const { response, request } = require("express");

const {db} = require('../utils/admin')

exports.getAllTodos = async(request, response)=>{
    try {
        let data = await db.collection('todos').get()
        let todos = []
        data.forEach(doc=>{
            let doc_data = doc.data()
            doc_data['id'] = doc.id
            todos.push(doc_data)
        })
        return response.json(todos);
    } catch (error) {
        return response.json(error)
    }
}

exports.addOneTodo = async(request, response)=>{
    try {
        let newTodo = {
            title: request.body.title,
            description: request.body.description,
            created_at: new Date().toISOString(),
            user_id: request.user.email
        } 

        const data = await db.collection('todos').add(newTodo)
        
        newTodo['id'] = data.id
        return response.json({status: true, newTodo})

    } catch (error) {
        return response.status(500).json({status: false, message: error.message})
    }
}

exports.getOneTodo = async(request, response) =>{
    try{
        let doc = await db.collection('todos').document(request.params.id).get()
        let todo = doc.data()
        todo['id'] = doc.id
        return response.status(200).json({todo})
    }catch(error){
        return response.status(500).json({status: false, message: error.message})
    }
}

exports.updateOneTodo = async(request, response)=>{
    try {
        const document = db.collection('todos').doc(request.params.id)
        const data = await document.update(request.body)
        return response.status(200).json({status: true, message: 'Updated successfully'})

    } catch (error) {
        return response.status(500).json({status: false, message: error.message})
    }
}

exports.deleteOneTodo = async(request, response) => {
    try{
        const document = db.collection('todos').doc(request.params.id)
        const data = await document.delete()
        return response.status(200).json({status: true, message: 'Todo deleted succesfully'})

    }catch(error){
        return response.status(500).json({status: false, message: error.message})
    }
}
