const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {jwtkey} = require('../keys')
const router = express.Router();
const User = mongoose.model('User');


router.post('/signup',async (req,res)=>{
   
  const {email,nombre,password,foto} = req.body;

    try{
      const user = new User({email,nombre,password,foto});
      await  user.save();
      const token = jwt.sign({userId:user._id},jwtkey)
      res.send({token})

    }catch(err){
      const error='el Correo ya se encuentra registrado';
      console.log(error)
      res.send(error)
    }
    
    
})


router.put('/user/:id', async (req,res)=>{
   

  
  var condition={_id:req.params.id};

  const {email,nombre,foto} = req.body;
  const dato={
    email,
    nombre,
    foto
 
  }



  try{

    
    await  User.update(condition,dato);
   res.send(dato);

  }catch(err){
    return res.status(422).send(err.message)
  }
  
  
})

router.post('/signin',async (req,res)=>{
    const {email,password} = req.body
 

    if(!email || !password){
      const error='Debe ingresar el correo o contraseña'
      res.send(error);
      console.log(error)
        }
    const user = await User.findOne({email})
    if(!user){
     const error='Correo o contraseña incorrecto'
     console.log(error)
      res.send(error); 
        }
    try{
      await user.comparePassword(password);    
      const token = jwt.sign({userId:user._id},jwtkey)
      res.send({token})
    }catch(err){
     const error='Correo o contraseña incorrecto'
     console.log(error)
      res.send(error); 

    }
    


})


module.exports = router