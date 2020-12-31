const { request, response } = require('express');
const firebase = require('firebase')
const {db, admin} = require('../utils/admin')
const config = require('../utils/config')
const { validateLoginData, validateSignUpData } = require('../utils/validators');

//initialize firebase for auth
firebase.initializeApp(config)

//useful methods
deleteImages = async(filePath) => {
    const bucket = admin.storage().bucket()
    await bucket.deleteFiles({
        prefix: filePath
    })
    return 0
}

exports.loginUser = async(request, response)=>{
    const user = {
        email: request.body.email,
        password: request.body.password
    }

    const {valid, errors} = validateLoginData(user)
    if(!valid) return response.status(400).json(errors)

    try {
        const data = await firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        let token = await data.user.getIdToken()
        return response.status(200).json({token})
    } catch (error) {
        return response.status(400).json({status: false, message: error.message})
    }
}


exports.signUpUser = async(request, response) =>{
    const newUser = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        password: request.body.password,
        created_at: new Date().toISOString()
    }

    const { valid, errors } = validateSignUpData(newUser);
    if (!valid) return response.status(400).json(errors);
    
    try {
        let newUserData = await firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
        let id = newUserData.user.uid
        newUser['id'] = id
        delete newUser.password
        let token = await newUserData.user.getIdToken()

        let data = await db.collection('users').doc(`${newUser.email}`).set(newUser)
        return response.status(201).json({token})
    } catch (error) {
        return response.status(500).json({status: false, message: error.message})
    }
}


exports.uploadProfilePhoto = (request, response)=>{
    const BusBoy = require('busboy');
	const path = require('path');
	const os = require('os');
	const fs = require('fs');
    const busboy = new BusBoy({ headers: request.headers });
    

	let imageFileName;
    let imageToBeUploaded = {};
    const destination = `profileImages/${request.user.email}/`
    
    try {
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            if (!mimetype.startsWith('image/')) {
                return response.status(400).json({status: false, message: 'Wrong file type submited' });
            }
            const imageExtension = filename.split('.')[filename.split('.').length - 1];
            imageFileName = `${request.user.email}.${imageExtension}`;
            const filePath = path.join(os.tmpdir(), imageFileName);
            imageToBeUploaded = { filePath, mimetype };
            file.pipe(fs.createWriteStream(filePath));
            deleteImages(destination)
        });        

        busboy.on('finish', async() => {
            const bucket = admin.storage().bucket()
            const [file] = await bucket.upload(imageToBeUploaded.filePath, {destination: destination, public: true})
            const imageUrl = file.metadata.mediaLink
            let data =  await db.doc(`/users/${request.user.email}`).update({imageUrl});
            return response.json({status: true, imageUrl, message: 'Image uploaded successfully' });
        })

        busboy.end(request.rawBody);

    }catch (error) {
        return response.status(500).json({status: false, message: error.message})
    }
}

exports.getUser = async(request, response) =>{
    try {
        let doc = await db.doc(`users/${request.user.email}`).get()
        let user = doc.data()
        user['id'] = doc.id
        return response.json(user)
    } catch (error) {
        return response.status(500).json({status: false, message: error.message})
    }
}

exports.updateUser = async(request, response)=>{
    try {
        let doc = db.doc(`users/${request.params.id}`)
        let updated = await doc.update(request.body)
        return response.json({status: true, message: 'Updated successfully'})
    } catch (error) {
        return response.status(500).json({status: false, message: error.message})
    }
}

exports.getUserTodos = async(request, response) =>{
    try{
        const docs = await db.collection('todos').where('user_id', '==', request.user.email).get()
        
        let todos = []
        docs.forEach(doc=>{
            let todo = doc.data()
            todo['id'] = doc.id
            todos.push(todo)
        })

        return response.status(200).json(todos)
    }catch(error){
        return response.status(400).json({status: false, message: error.message})
    }
}
