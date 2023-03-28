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

dbConnection()

app.listen(4000,()=>{
  console.log('Server started at PORT 4000');
})

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
