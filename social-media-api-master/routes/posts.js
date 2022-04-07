const router=require('express').Router();
const Posts=require('../controllers/posts');
const multer=require('multer');

const FILE_MYME_TYPES={
	'image/jpeg':'jpeg',
	'image/png':'png',
	'image/jpg':'jpg'
} 

const storage=multer.diskStorage({
	destination:(req,file,cb)=>{
		const isValid=FILE_MYME_TYPES[file.mimetype];
		let error=new Error('invalid image type');

		if(isValid) error=null;
		cb(null,'public/uploads');
	},
	filename:(req,file,cb)=>{
		const fieldName=file.originalname;
		cb(null,`${Date.now()}-${fieldName}`);
	}
})

const uploadOptions=multer({storage:storage});

router.post('/',uploadOptions.single('image'),Posts.create);
router.put('/:id',uploadOptions.single('image'),Posts.update);
router.delete('/:id',Posts.delete);
router.get('/:id',Posts.get);
router.put('/:id/like',Posts.like);
router.get('/timeline/:id',Posts.timeline);
router.get('/profile/:username',Posts.userPosts);

module.exports=router;