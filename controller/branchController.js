const boards = require('../models/boardModel')
const branch = require('../models/branchModel')


module.exports.addBranch = async(req,res) => {
  try {
    console.log('in');
    console.log(req.body);
    const newBranch = new branch({
      name: req.body.branch,
      board:req.body.board
    });
  
    newBranch.save()
      .then(savedBranch => {
        res.status(201).json({message:'Branch is added',success:true});
      })
      .catch(error => {
        res.status(500).json({ error: error.message ,success:false});
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message ,success:false});
  }
}

module.exports.allBranches = async(req,res,next)=>{
  try {
    
    const {board} = req.query

    if (!board) {
    const branches = await branch.find({listed:true})
    res.json({ status: true, message: "success", branches });
       
    }else{
    const selectedBoard = await boards.findById(board)
    if(!selectedBoard){

      return res.status(404).json({message:'selected board not found'})
    }
    const branches = await branch.find({board:selectedBoard,listed:true})
    res.json({ status: true, message: "success", branches });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({message:'Server gone...'})
  }
}



module.exports.adminAllBranches = async(req,res,next)=>{
  try {
    
    const {board} = req.query

    if (!board) {
    const branches = await branch.find()
    res.json({ status: true, message: "success", branches });
       
    }else{
    const selectedBoard = await boards.findById(board)
    if(!selectedBoard){

      return res.status(404).json({message:'selected board not found'})
    }
    const branches = await branch.find({board:selectedBoard})
    res.json({ status: true, message: "success", branches });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({message:'Server gone...'})
  }
}