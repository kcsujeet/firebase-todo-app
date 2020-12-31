const { admin, db } = require('./admin');

module.exports  =  async(request, response, next) => {
	let idToken;
	if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
		idToken = request.headers.authorization.split('Bearer ')[1];
	} else {
		console.error('No token found');
		return response.status(403).json({ status: false, error: 'Unauthorized' });
	}
    
    try{
        let decodedToken = await admin.auth().verifyIdToken(idToken)
        request.user = decodedToken;
        let data = await db.collection('users').where('id', '==', request.user.uid).limit(1).get();
        request.user.email = data.docs[0].data().email;
        request.user.imageUrl = data.docs[0].data().imageUrl;
        return next();
		
    }catch(error){
        console.error('Error while verifying token', error);
        return response.status(403).json({status: false, message: error.message, code: error.code});
	}
};