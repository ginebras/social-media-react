const router=require('express').Router();
const Auth=require('../controllers/auth');

router.post('/register',Auth.register);
router.post('/login',Auth.login);
router.get('/authToken',Auth.authToken);

module.exports=router;