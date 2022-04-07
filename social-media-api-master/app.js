const express=require('express');
const app=express();
const cors=require('cors');
const morgan=require('morgan');
const dotenv=require('dotenv').config();
const authJwt=require('./helpers/jwt');
const errorHandler=require('./helpers/handleError');

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('tiny'));
app.use(cors());
app.use(authJwt());
app.use('/public/uploads',express.static(__dirname+'/public/uploads'));
app.use(errorHandler);

//ROUTES
app.use('/api/users',require('./routes/users'));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/posts',require('./routes/posts'));
app.use('/api/conversation',require('./routes/conversation'));
app.use('/api/messages',require('./routes/message'));

//EXPORTS
module.exports=app;