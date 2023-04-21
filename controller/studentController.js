const students = require('../models/studentModel')
const Razorpay = require('razorpay')
const crypto = require('crypto')
const plans = require('../models/plansModel')

const key_id = process.env.KEY_ID
const key_secret = process.env.SECRET_KEY



module.exports.adminAllStudents = async(req,res,next) => {
  try {
    const student = await students.find().populate().populate('branch','name').populate('board','name')
     console.log(student);
     res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}



module.exports.adminBlockUnblockStudent = async(req,res,next) =>{
  try {
    const {student} = req.query
    const studentsToUpdate = await students.findById(student)
    if(studentsToUpdate.blocked){
      console.log("in");
      await students.updateOne({_id:student},{$set:{blocked:false}})
      res.json({message:'Student is successfully unblocked',success:true})
    }else{
      await students.updateOne({_id:student},{$set:{blocked:true}})
      res.json({message:'Student is successfully blocked',success:true})
    }
    
  } catch (error) {
    console.log(error);
res.status(500).json({ message: "Something gone wrong", success: false });
  }
}

module.exports.planPayment = async(req,res) =>{
     try {

      const plan = await plans.findById(req.body.id)

      console.log(key_id,key_secret,'kkkk');

      const instance = new Razorpay({
        key_id,
        key_secret
      })

      const options = {
        amount:plan.price*100,
        currency:"INR",
        receipt:crypto.randomBytes(10).toString('hex')
      }

      instance.orders.create(options,(error,order) => {
        if(error){
          console.log(error);
          return res.status(500).json({message:'Something gone wrong'})
        }
        res.status(200).json({data:order})
      })
      
     } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
     }
}

module.exports.verifyPayment = async(req,res) => {
  try {
    // console.log(req.body);
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan
    } = req.body
    console.log(plan,'pp');

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    console.log(sign);
    const expectedSign = crypto
      .createHmac("sha256", key_secret)
    .update(sign.toString())
    .digest('hex');
    console.log(expectedSign);
    console.log(razorpay_signature);

    if(razorpay_signature === expectedSign){
      const startDate = new Date()
      const endDate = new Date()
      console.log(startDate,endDate);
      endDate.setMonth(endDate.getMonth()+ plan.duration)

      const selectedPlan = await plans.findById(plan._id)

      const subscription = {
        user: req.user,
        startedAt: startDate,
        expiredAt: endDate
      }

      selectedPlan.used_by.push(subscription)

      selectedPlan.save()

     const updatedStudents = await students.findByIdAndUpdate({_id:req.user},{
        $set:{
          subscription:{
            plan:plan._id,
            startedAt:startDate,
            expiredAt:endDate
          }
        }
      })
      if(updatedStudents){
        return res.status(200).json({ message: 'Payment verified successfully', verified: true })
      }else{
        return res.status(400).json({ message: 'Something gone wrong', verified: false })
      }
    }else{
      return res.status(400).json({ message: 'Invalid signature sent',verified: false })
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

module.exports.planDetails = async (req, res, next) => {
  try {

    const student = await students.findById(req.user)
    if(student.subscription){
      const isActive = Date.now() < new Date(student.subscription.expiredAt);
      console.log(isActive, "activvvvvvvvv");
      if(isActive){
        return res.status(200).json({ message: 'Active Subscription found', subscribed: isActive })
      }else{
        return res.status(200).json({ message: 'Subscription expired', subscribed: isActive })
      }
    }else{
      return res.status(200).json({ message: 'You are not subscribed to any plans', subscribed: false })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

