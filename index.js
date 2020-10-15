const express  = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
app.set('port', process.env.PORT || 3000);

/* const PORT = 3000 */
const {mogoUrl} = require('./keys')


require('./models/User');

const requireToken = require('./middleware/requireToken')
const authRoutes = require('./routes/authRoutes')
app.use(bodyParser.json())
app.use(authRoutes)

mongoose.connect(mogoUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on('connected',()=>{
    console.log("connected to mongo yeahh")
})

mongoose.connection.on('error',(err)=>{
    console.log("this is error",err)
})



app.get('/',requireToken,(req,res)=>{
    res.send({id:req.user.id,email:req.user.email,nombre:req.user.nombre,foto:req.user.foto})
})

app.listen(app.get('port'),()=>{
    console.log(`Server on port ${app.get('port')}`);
})