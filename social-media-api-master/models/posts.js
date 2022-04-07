const mongoose=require('mongoose');

const PostSchema=mongoose.Schema({
	autor:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'users',
		required:true,
	},
	description:{
		type:'string',
		default:'',
		required:true
	},
	image:{
		type:'string',
		required:true
	},
	likes:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:'users',
		default:[]
	}],
},
	{timestamps:true}
)

module.exports=mongoose.model('posts',PostSchema);