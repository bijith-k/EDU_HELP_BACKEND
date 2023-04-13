const plans = require('../models/plansModel')

module.exports.addPlan = async (req,res,next) => {
  try {
    console.log('in');
    console.log(req.body);
    const newPlan = new plans({
      plan: req.body.plan,
      duration:req.body.duration,
      price:req.body.price
    });
  
    newPlan.save()
      .then(savedPlan => {
        res.status(201).json({message:'Plan is added',success:true});
      })
      .catch(error => {
        res.status(500).json({ error: error.message ,success:false});
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message ,success:false});
  }
}


module.exports.adminAllPlans = async(req,res,next) =>{
  try {
    if(req.query.id){
     console.log(req.query,'query');
     const {id} = req.query
     console.log(id,'idddd');
   const plan = await plans.findOne({_id:id})
   res.json(plan);
    }else{
     const plan = await plans.find()
     console.log(plan);
     res.json(plan);
    }
  
 } catch (err) {
   console.error(err);
   res.status(500).json({ message: "Server error" });
 }
}

module.exports.adminPlanListOrUnList = async(req,res,next) =>{
  try {
    const {plan} = req.query
    const planToListOrUnList = await plans.findById(plan)
    if(planToListOrUnList.listed){
      console.log("in");
      await plans.updateOne({_id:plan},{$set:{listed:false}})
      res.json({message:'Plan is successfully unlisted',success:true})
    }else{
      await plans.updateOne({_id:plan},{$set:{listed:true}})
      res.json({message:'Plan is successfully listed',success:true})
    }
    
  } catch (error) {
    console.log(error);
res.status(500).json({ message: "Something gone wrong", success: false });
  }
}



module.exports.updatePlans = async(req,res,next) =>{
  try {
    console.log('inside upplan');
    console.log(req.body,'body');
    const {plan} = req.query

    

    let updatedData = {
      plan:req.body.plan,
      duration:req.body.duration,
      price:req.body.price,
    }

    

    let updatedPlan  = await plans.findByIdAndUpdate({_id:plan},updatedData)

    if(updatedPlan){
      res.json({ message: "Plan is updated successfully", updated: true });
    }else{
res.status(500).json({ message: "Error while updating", updated: false });
    }
     
  } catch (error) {
    console.log(error);
res.status(500).json({ message: "Something gone wrong", updated: false });
  }
}

module.exports.getPlans = async(req,res,next) =>{
    try {
        
        const plan = await plans.find({listed:true})
        console.log(plan,"lls");
        res.json(plan);
      
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
