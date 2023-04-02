
const board = require('../models/boardModel')


module.exports.addBoard = async(req,res) => {
  try {
    console.log('in');
    console.log(req.body);
    const newBoard = new board({
      name: req.body.board
    });
  
    newBoard.save()
      .then(savedBoard => {
        res.status(201).json({message:'Board is added',success:true});
      })
      .catch(error => {
        res.status(500).json({ error: error.message ,success:false});
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message ,success:false});
  }
}

module.exports.allBoards = async(req,res,next) =>{
  try {

    const boards = await board.find({listed:true})
    res.json({ status: true, message: "success", boards });

  } catch (error) {
    console.log(error);
  }
}

module.exports.adminAllBoards = async(req,res,next) =>{
  try {

    const boards = await board.find()
    res.json({ status: true, message: "success", boards });

  } catch (error) {
    console.log(error);
  }
}