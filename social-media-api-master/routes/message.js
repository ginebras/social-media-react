const router=require('express').Router();
const Messages=require('../controllers/messages');

router.post('/',Messages.sendMessages);
router.get('/:conversationId',Messages.getMessages);

module.exports=router;