function errorHandler(err,req,res,next){
	if(err.name==='UnauthorizedError'){
		return res.status(400).send('User not authorized');
	}

	return res.status(500).send({err});
}

module.exports=errorHandler;