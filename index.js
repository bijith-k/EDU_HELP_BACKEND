const express = require('express')
const app = express()
const dbConnection = require('./dbConnection/db')
const cors = require('cors')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')
const studentRouter = require('./routes/studentRouter')
const authRouter = require('./routes/authRouter')
const adminRouter = require('./routes/adminRouter')
const tutorRouter = require('./routes/tutorRouter')
const socket = require('socket.io')


dbConnection()

app.use(
  cors({
    origin : "*",
    methods:['GET','POST','DELETE','PUT'],
    credentials:true,
  })
)


app.use(cookieParser())
app.use(logger('dev'))
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, "public")));



app.use("/", studentRouter);
app.use('/auth',authRouter);
app.use('/admin',adminRouter);
app.use('/tutor',tutorRouter);

const server = app.listen(4000, () => {
  console.log('Server started at PORT 4000');
})

// const io = require("socket.io")(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: "*",
//     // credentials: true,
//   },
// });

// let users = []

// const addUser=(userId,socketId) =>{
//   !users.some((user)=>user.userId === userId)&&
//   users.push({userId,socketId})
//   // console.log(users,"addd");
// }

// const removeUser = (socketId)=>{
//   users = users.filter(user=>user.socketId !== socketId)
// }

// const getUser = (userId) =>{
//   // console.log(users,"get");
//   return users.find(user => user.userId === userId)
// }

// io.on("connection", (socket) => {
//   console.log('a user connected');
  
//   //take userId and socktId from user
//   socket.on("addUser",userId=>{
//      addUser(userId,socket.id)
//      io.emit("getUsers",users)
//   })


//   //send and get message
//   socket.on("sendMessage",({senderId,receiverId,text})=>{
//     // console.log(receiverId,"receiver");
//       const user = getUser(receiverId)
//       //  console.log(user,"user");
//       io.to(user.socketId).emit("getMessage",{
//         senderId,
//         text
//       })
//   })

//   socket.on("sendTutorMessage", ({ senderId, receiverId, text }) => {
//     // console.log(receiverId,"receiver");
//     const user = getUser(receiverId)
//     //  console.log(user,"user");
//     io.to(user.socketId).emit("getMessage", {
//       senderId,
//       text
//     })
//   })
  
//   //when disconnect
//   socket.on("disconnect",()=>{
//     console.log('a user disconnected');
//     removeUser(socket.id)
//     io.emit("getUsers", users)
//   })
// });

// io.on("connection",(socket) => {
//   console.log("connected to socket.io")

//   socket.on("setup",(userData)=>{
//       socket.join(userData._id)
//       socket.emit("connected")
//   })

//   socket.on("join chat",(room)=>{
//     socket.join(room)
//     console.log("user joined room"+room);
//   })

//   socket.on('new message',(newMessageReceived)=>{
   
//     if (!newMessageReceived.sender) return console.log('chat.users not defined')
//     socket.in(newMessageReceived.sender).emit("message received",newMessageReceived)
//   })


// })



const io = socket(server,{
  cors:{
    origin:"http://localhost:5173",
    credentials:true,
  }
})

global.onlineUsers = new Map()

io.on("connection",(socket)=>{
  global.chatSocket = socket;
  socket.on("add-user",(userId)=>{
    onlineUsers.set(userId,socket.id)
  })

  socket.on("send-msg",(data)=>{
    const sendUserSocket = onlineUsers.get(data.receiverId)
    if(sendUserSocket){
      socket.to(sendUserSocket).emit("msg-receive",data)
    }
  })
})
