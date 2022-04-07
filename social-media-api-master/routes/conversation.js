const router=require('express').Router();
const Conversation=require('../controllers/conversation');

router.post('/createConversation',Conversation.newConversation);
router.get('/:userId',Conversation.getConversations);
router.get('/:firstId/:secondId',Conversation.getConversationBetween);

module.exports=router;