const router=require('express').Router();
const Users=require('../controllers/user');
const multer=require('multer');

const FILE_MYME_TYPES={
	'image/png':'png',
	'image/jpeg':'jpeg',
	'image/jpg':'jpg'
}

const storage=multer.diskStorage({
	destination:(req,file,cb)=>{
		const isValid=FILE_MYME_TYPES[file.mimetype];
		let uploadError=new Error('invalid image type');

		if(isValid) uploadError=null;
		cb(null,'public/uploads');
	},
	filename:(req,file,cb)=>{
		const fieldName=file.originalname;
		cb(null,`${Date.now()}-${fieldName}`);
	}
})

const uploadOptions=multer({storage:storage});

router.put('/:id',uploadOptions.single('profilePicture'),Users.update);
router.delete('/:id',Users.delete);
router.get('/',Users.user);
router.put('/:id/follow',Users.follow);
router.put('/:id/unfollow',Users.unfollow);
router.get('/friendList/:id',Users.friendList);
	
module.exports=router;