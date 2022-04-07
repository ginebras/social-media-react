const expressJwt=require('express-jwt');
const secret=process.env.SECRET;

function authJwt(){
	return expressJwt({
		secret,
		algorithms:['HS256'],
	}).unless({
		path:[
			{ url:/\/api\/users(.*)/ ,methods:['GET','POST','PUT','DELETE','OPTIONS']},
			{ url:/\/api\/auth(.*)/, methods:['POST','OPTIONS']},
			{ url:/\/api\/posts(.*)/,methods:['GET','POST','PUT','DELETE','OPTIONS']},
			{ url:/\/api\/conversation(.*)/,methods:['GET','POST','PUT','DELETE','OPTIONS']},
			{ url:/\/api\/messages(.*)/,methods:['GET','POST','PUT','DELETE','OPTIONS']},
			{ url:/\/public\/uploads(.*)/,methods:['GET','OPTIONS'] },
			{ url:/\/favicon(.*)/,methods:['GET','OPTIONS'] }
		]
	})
}

module.exports=authJwt;