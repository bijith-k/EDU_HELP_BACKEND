const conversation = require('../models/conversation')
const message = require('../models/message')


module.exports.newMessage = async (req, res) => {
  try {
    const newMessage = new message(req.body)

    const savedMessage = await newMessage.save()
    res.status(200).json(savedMessage)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

module.exports.getMessage = async (req, res) => {
  try {
    const messages = await message.find({
      conversationId:req.params.conversationId
    })
    res.status(200).json(messages)

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' })
  }
}