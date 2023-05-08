
const board = require('../models/boardModel')


module.exports.addBoard = async (req, res) => {
  try {

    const newBoard = new board({
      name: req.body.board
    });

    newBoard.save()
      .then(savedBoard => {
        res.status(201).json({ message: 'Board is added', success: true });
      })
      .catch(error => {
        res.status(500).json({ error: error.message, success: false });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message, success: false });
  }
}

module.exports.updateBoard = async (req, res, next) => {
  try {

    const { id } = req.query


    let updatedData = {
      name: req.body.name
    }


    let updatedNote = await board.findByIdAndUpdate({ _id: id }, updatedData)

    res.json({ message: "Board is updated successfully", updated: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", updated: false });
  }
}


module.exports.adminBoardListOrUnList = async (req, res, next) => {
  try {
    const { id } = req.query
    const BoardToListOrUnList = await board.findById(id)
    if (BoardToListOrUnList.listed) {

      await board.updateOne({ _id: id }, { $set: { listed: false } })
      res.json({ message: 'Board is successfully unlisted', success: true })
    } else {
      await board.updateOne({ _id: id }, { $set: { listed: true } })
      res.json({ message: 'Board is successfully listed', success: true })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", success: false });
  }
}

module.exports.allBoards = async (req, res, next) => {
  try {

    const boards = await board.find({ listed: true })
    res.json({ status: true, message: "success", boards });

  } catch (error) {
    console.log(error);
  }
}

module.exports.adminAllBoards = async (req, res, next) => {
  try {

    const { id } = req.query

    if (!id) {
      const boards = await board.find()
      res.json({ status: true, message: "success", boards });
    }
    else {
      const boards = await board.findById(id)
      res.json({ status: true, message: "success", boards });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server gone...' })
  }
}



module.exports.boardContentCount = async (req, res, next) => {
  try {
    const boards = await board.aggregate([
      {
        $lookup: {
          from: 'notes',
          localField: '_id',
          foreignField: 'board',
          as: 'notes'
        }
      },
      {
        $lookup: {
          from: 'videos',
          localField: '_id',
          foreignField: 'board',
          as: 'videos'
        }
      },
      {
        $lookup: {
          from: 'question_papers',
          localField: '_id',
          foreignField: 'board',
          as: 'questionPapers'
        }
      },
      {
        $project: {
          name: 1,
          noteCount: { $size: '$notes' },
          videoCount: { $size: '$videos' },
          questionPaperCount: { $size: '$questionPapers' }
        }
      }
    ]);

    res.json(boards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server gone...' })
  }
}