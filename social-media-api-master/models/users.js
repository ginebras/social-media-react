const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UserSchema=Schema({
	username:{
		type:String,
		required:true,
		unique:true,
		min:6,
	},
	email:{
		type:String,
		required:true,
		unique:true
	},
	password:{
		type:String,
		required:true,
		min:6
	},
	profilePicture:{
		type:String,
		default:''
	},
	coverPicture:{
		type:String,
		default:''
	},
	followers:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:'users',
		default:[]
	}],
	following:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:'users',
		default:[]
	}],
	isAdmin:{
		type:Boolean,
		default:false
	},
	description:{
		type:String,
		default:''
	},
	city:{
		type:String,
		default:''
	},
	from:{
		type:String,
		default:''
	},
	relationship:{
		type:Number,
		enum:[1,2,3],
		default:1
	}
	
},{ timestamps:true})

module.exports=mongoose.model('users',UserSchema);