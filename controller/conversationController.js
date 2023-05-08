const conversation = require('../models/conversation')
const message = require('../models/message')


module.exports.newConversation = async (req, res) => {
  try {

    const convo = await conversation.findOne({ members: [req.body.senderId, req.body.receiverId] })
    if (convo) {
      res.status(200).json({ suceess: true })
    } else {
      const newConversation = new conversation({
        members: [req.body.senderId, req.body.receiverId]
      })

      const savedConversation = await newConversation.save()
      res.status(200).json(savedConversation)
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

module.exports.getConversation = async (req, res) => {
  try {

    const conversations = await conversation.find({
      members: { $in: [req.params.userId] }
    })

    res.status(200).json(conversations)

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' })
  }
}