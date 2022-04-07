const app=require('./app');
const mongoose=require('mongoose');

mongoose.Promise=global.Promise;

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true},()=>{
	console.log('Conexion a base de datos establecida');

	app.listen(process.env.PORT || 3700 ,()=>{
		console.log(`Servidor escuchando en localhost:${process.env.PORT||3700}`);
	})
})