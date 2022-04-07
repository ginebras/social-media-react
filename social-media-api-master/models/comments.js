const mongoose=require('mongoose');

const CommentSchema=mongoose.Schema({
	text:{
		type:String,
		required:true
	},
	autor:{
		type:String,
		required:true
	},
	post:{
		type:String,
		required:true
	},
	likes:[{
		type:String,
		default:[]
	}]

},{timestamps:true})

module.exports=mongoose.model('comments',CommentSchema);