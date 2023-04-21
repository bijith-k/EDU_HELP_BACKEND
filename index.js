const express = require('express')
const app = express()
const session = require('express-session');
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

dbConnection()
app.use(
  cors({
    origin : "*",
    methods:['GET','POST','DELETE','PUT'],
    credentials:true,
  })
)


app.listen(4000,()=>{
  console.log('Server started at PORT 4000');
})

app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 24 * 1 * 1000 }
}));


 




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