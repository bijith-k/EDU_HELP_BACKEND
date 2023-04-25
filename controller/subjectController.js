
const subject = require('../models/subjectModel')
const branches = require('../models/branchModel')



module.exports.addSubject = async(req,res) => {
  try {
    console.log('in');
    console.log(req.body);
    const newSubject = new subject({
      name: req.body.subject,
      board:req.body.board,
      branch:req.body.branch
    });
  
    newSubject.save()
      .then(savedSubject => {
        res.status(201).json({message:'Subject is added',success:true});
      })
      .catch(error => {
        res.status(500).json({ error: error.message ,success:false});
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message ,success:false});
  }
}


module.exports.allSubjects = async(req,res,next)=>{
  try {
    
    const {branch} = req.query
console.log(branch);
    if (!branch) {
    const subjects = await subject.find({listed:true}).populate('branch','name')
    console.log(subjects);
    res.json({ status: true, message: "success", subjects })
       
    }else{
    const selectedBranch = await branches.findById(branch)
    if(!selectedBranch){

      return res.status(404).json({message:'selected branch not found'})
    }
    const subjects = await subject.find({branch:selectedBranch,listed:true}).populate('branch','name')
    res.json({ status: true, message: "success", subjects });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message:'Server gone...'})
  }
}



module.exports.adminAllSubjects = async(req,res,next)=>{
  try {
    
    const {branch} = req.query
    const { id } = req.query

    if (branch) {
      const selectedBranch = await branches.findById(branch)
      if (!selectedBranch) {

        return res.status(404).json({ message: 'selected branch not found' })
      }
      const subjects = await subject.find({ branch: selectedBranch }).populate('branch', 'name')
      res.json({ status: true, message: "success", subjects });
   
    }
    else if(id){
      const subjects = await subject.findById(id).populate("branch", "name")
      res.json({ status: true, message: "success", subjects });
    }
    else{
      const subjects = await subject.find().populate('branch', 'name')
       
      res.json({ status: true, message: "success", subjects })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message:'Server gone...'})
  }
}


module.exports.updateSubject = async (req, res, next) => {
  try {

    const { id } = req.query


    let updatedData = {
      name: req.body.subject,
      branch: req.body.branch
    }


    let updatedSubject = await subject.findByIdAndUpdate({ _id: id }, updatedData)

    res.json({ message: "Subject is updated successfully", updated: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something gone wrong", updated: false });
  }
}