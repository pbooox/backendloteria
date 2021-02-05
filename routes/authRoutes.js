/*                                 const express = require('express')
                                const axios = require('axios');


                                const mongoose = require('mongoose')
                                const jwt = require('jsonwebtoken')
                                const {jwtkey} = require('../keys')
                                const router = express.Router();
                                const User = mongoose.model('User');
                                const Maiz = mongoose.model('Maiz');
                                const Maiz2 = mongoose.model('Maiz2');

                                const Premio = mongoose.model('Premio');
                                const multer = require('multer');
                                const fs = require("fs");
                                const requireToken = require('../middleware/requireToken')
                                const bodyParser = require('body-parser')

                                const passport = require ('passport');
                                const FacebookStrategy = require ('passport-facebook').Strategy;
                                const GoogleStrategy = require ('passport-google-oauth20').Strategy;
                                const cloudinary=require('cloudinary');

                                cloudinary.config({
                                  cloud_name:'dzs6u1kal',
                                  api_key:'791179526877961',
                                  api_secret:'ynb_EJlMiSadVDRPIR2ORMLJ2vE'


                                })



                                    const upload = multer({ 
                                      dest: "upload/",
                                    });
                                                            
                                    router.use(express.static('upload'))

                                    router.use(bodyParser.urlencoded({ extended: true }))
                                    router.use(bodyParser.json({ limit: '15MB' }))

                                passport.serializeUser((user, done) => done(null, user));

                          
                                passport.deserializeUser((user, done) => done(null, user));

                                passport.use(new GoogleStrategy({
                                  clientID: "390484653598-7egpn92fieb83krkm49t68qh2gvai1vc.apps.googleusercontent.com", 
                                  clientSecret: "WxnPzf7zU63X5bVEDm-6BYFj", 
                                  callbackURL: '/auth/google/callback'
                                  }, (accessToken, refreshToken, profile, done) => {

                                  done(null, profile, accessToken );

                                  }))

                               


                                  passport.use(new FacebookStrategy({
                                    clientID: "1690675411093038", 
                                    clientSecret: "f586453d81e7285f7e396ff228cdeaf8", 
                                    callbackURL: '/auth/facebook/callback',
                                    profileFields: ['email', 'name', 'displayName', 'picture']
                                    }, (accessToken, refreshToken, profile, done) => {
  
                                    done(null, profile, accessToken );
  
                                    }))








                                    router.get('/auth/facebook', passport.authenticate('facebook'));

                                    router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }), async(req, res, next) => {
                                      const email=req.user.emails[0].value;
                                      const nombre=req.user.name.givenName;
                                       nombre.split(" ",1);
                                      const password="";
                                      const foto=req.user.photos[0].value;


                                      try{
                                        const user = new User({email,nombre,password,foto});
                                        await  user.save();
                                        const token = jwt.sign({userId:user._id},jwtkey)
                                        res.redirect("msrm42app://msrm42app.io?id="+token); 


                                       }catch(err){
                                     


                                        const user = await User.findOne({email})
                                        if(!user){
                                        const error='Correo o contraseña incorrecto'
                                        console.log(error)
                                          res.send(error); 
                                            }
                                        try{
                                          const token = jwt.sign({userId:user._id},jwtkey)
                                          res.redirect("msrm42app://msrm42app.io?id="+token); 

                                        }catch(err){
                                        const error='Correo o contraseña incorrecto'
                                        console.log(error)
                                          res.send(error); 
  
                                        }






                                      } 



                                    });
                               

                                    router.get('/politica/de/privacidad',(req,res)=>{

                                      const mensaje='hola'
                                      res.send({mensaje});

                                    })

                                  router.get('/auth/google', passport.authenticate('google', {
                                    scope: ['profile', 'email'],
                                    }));
                                
                                    router.get('/auth/google/callback', passport.authenticate('google'), async(req, res, next) => {

                                      const email=req.user.emails[0].value;
                                      const nombreaux=req.user.name.givenName.split(" ",1);
                                      const password="";
                                      const foto=req.user.photos[0].value;
                                      let nombre="";

                                      if( nombreaux.toString().length>9){

                                       nombre= nombreaux.toString().substr(0,9)

                                      }else{
                                        nombre=nombreaux+' ';

                                      }
                                      console.log(nombre)
                                      
                                        try{

                                          const  correo= await User.findOne({email})
                                          if(!correo){
                                          
                                        const user = new User({email,nombre,password,foto});
                                        let guarda= await  user.save();

                                          console.log('valor de guarda: '+guarda);
                                        if(guarda){

                                          const maiz=new Maiz({
                                            amarillo:'0',
                                            morado:'0',
                                            blanco:'0',
                                            rojo:'0',
                                            user:user._id
                                          });
                                           await maiz.save();

                                           const maiz2=new Maiz2({
                                            amarillo:'0',
                                            morado:'0',
                                            blanco:'0',
                                            rojo:'0',
                                            user:user._id
                                          });
                                           await maiz2.save();
                                        }
                                        const token = jwt.sign({userId:user._id},jwtkey)
                                                                                   

                                       res.redirect("msrm42app://msrm42app.io?id="+token); 
                                      }else{

                                        const token2 = jwt.sign({userId:correo._id},jwtkey)
                                        res.redirect("msrm42app://msrm42app.io?id="+token2);
                                      
                                            
                                      }
                                       }catch(err){
                                       
                                        const error='el Correo ya se encuentra registrado';
                                        console.log(error)
                                        res.send(error)

                                      }  



                                      
                                    });








                                  router.post('/signup',async (req,res)=>{
                                

                                    const {email,nombre,password,foto} = req.body;
                                      try{

                                        const  correo= await User.findOne({email})
                                          if(!correo){

                                        const user = new User({email,nombre,password,foto});
                                       
                                       let guarda2= await  user.save();
                                        


                                        if(guarda2){


                                          const maiz=new Maiz({
                                            amarillo:'0',
                                            morado:'0',
                                            blanco:'0',
                                            rojo:'0',
                                            user:user._id
                                          });
                                           await maiz.save();
                                           
                                           const maiz2=new Maiz2({
                                            amarillo:'0',
                                            morado:'0',
                                            blanco:'0',
                                            rojo:'0',
                                            user:user._id
                                          });
                                           await maiz2.save();

                                        }



                                        const token = jwt.sign({userId:user._id},jwtkey)
                                        res.send({token})

                                      }else{

                                        const error='el Correo ya se encuentra registrado';
                                        console.log(error)
                                        res.send(error)

                                      }

                                      }catch(err){
                                        const error='el Correo ya se encuentra registrado';
                                        console.log(error)
                                        res.send(error)
                                      }
                                      
                                      
                                  })



                                  router.post('/signup/google/',async (req,res)=>{

                                    let email=req.body.email;
                                    let nombreaux=req.body.nombreaux;
                                    let foto = req.body.foto;

                                    if(foto===null){

                                      foto='https://res.cloudinary.com/dzs6u1kal/image/upload/v1612367624/unscreen-001_udvrrv.png'
                                    }

                                    

                                    const password="";
                                  
                                    let nombre="";

                                    if( nombreaux.toString().length>9){

                                     nombre= nombreaux.toString().substr(0,9)

                                    }else{
                                      nombre=nombreaux+' ';

                                    }
                                    console.log('nombre: '+nombre)
                                    console.log('email: '+email);
                                    console.log('foto: '+foto)

                                  
                                    
                                      try{

                                        const  correo= await User.findOne({email})
                                        if(!correo){
                                        
                                      const user = new User({email,nombre,password,foto});
                                      let guarda= await  user.save();

                                        console.log('valor de guarda: '+guarda);
                                      if(guarda){

                                        const maiz=new Maiz({
                                          amarillo:'0',
                                          morado:'0',
                                          blanco:'0',
                                          rojo:'0',
                                          user:user._id
                                        });
                                         await maiz.save();

                                         const maiz2=new Maiz2({
                                          amarillo:'0',
                                          morado:'0',
                                          blanco:'0',
                                          rojo:'0',
                                          user:user._id
                                        });
                                         await maiz2.save();
                                      }
                                      const token = jwt.sign({userId:user._id},jwtkey)
                                      res.send({token})
                                          

                                    }else{

                                      const token = jwt.sign({userId:correo._id},jwtkey)
                                      res.send({token})
                                    
                                          
                                    }
                                     }catch(err){
                                     
                                      const error='el Correo ya se encuentra registrado';
                                      console.log(error)
                                      res.send(error)

                                    }  



                                    
                                  });






                                  router.post(('/compra'),async(req,res)=>{

                                    console.log('entra para la compra')
                                    const {foto,descripcion,fecha,departamento,color,user}=req.body;


                                    try {
                                      const premio = new Premio({foto,descripcion,fecha,departamento,color,user});
                                       console.log(premio);
                                        await  premio.save();

                                      res.send(premio);



                                    } catch (error) {
                                      console.log('no se pudo guardar el premio')
                                    }


                          
                                  })



                                  router.put('/actualiza/compra/:id',async(req,res)=>{

                                   
                                    const condition={_id:req.params.id};                              
                                     let morado=0,amarillo=0,blanco=0,rojo=0;
                                      let cupon=0,maiz=0,operacion='';
                                      let user_id=req.body.id_usuario;

                                       cupon=req.body.cupon;
                                       maiz=req.body.maiz;
                                        operacion=req.body.color;

                                

                                      const response = await axios.get('https://jsonplaceholder.typicode.com/users')
                                      console.log(response.data);
                                      
                                        const estrellas= await  Maiz.find({user:user_id})


                                        console.log(estrellas)

                                        return;


                                        amarillo=estrellas[0].amarillo;
                                      morado=estrellas[0].morado;
                                      blanco=estrellas[0].blanco;
                                      rojo=estrellas[0].rojo;
                                      
 
                                     if(operacion=="morado" && morado>=maiz && cupon>0 ){
                                       console.log('entra');
                                      morado=morado-maiz;
                                     }
 
                                     if(operacion=="blanco" && blanco>=maiz && cupon>0){
                                      console.log('entra');
                                      blanco=blanco-maiz;
                                     }
 
                                     if(operacion=="rojo" && rojo>=maiz && cupon>0){
                                      console.log('entra');
                                        rojo=rojo-maiz;
                                     }
 
                                     if(operacion=="amarillo" && amarillo>=maiz && cupon>0){
                                      console.log('entra  en amarillo: '+maiz);
                                      
                                     amarillo=amarillo-maiz;
                                   }

 
                                     const dato={
                                       amarillo,
                                       blanco,                                     
                                       morado,
                                       rojo
                                   
                                     }
 
 
 
                                     try{
 
                                       
                                      await  Maiz.update(condition,dato);
                                      res.send(dato); 
 
                                     }catch(err){
                                       return console.log(err); 
                                     }


                                  })

                                  // trae las estrellas
                                  router.get('/maiz/:id',(req,res)=>{

                                  
                                    const user = {_id:req.params.id}

                                    Maiz.find({user:user})
                                    .exec(function (err, maices) {
                                      if (err) return console.log(err);
                                      
                                      res.send(maices);
                                    });                            



                                   })

                                   router.get('/maiz2/:id',(req,res)=>{

                                  
                                    const user = {_id:req.params.id}

                                    Maiz2.find({user:user})
                                    .exec(function (err, maices) {
                                      if (err) return console.log(err);
                                      
                                      res.send(maices);
                                    });                            



                                   })



                                   router.put('/descontar/entra_sala/:id', async (req,res)=>{
                                    
                                    let amarillo=0,morado=0,blanco=0,rojo=0;

                                    let condition={_id:req.params.id};
                               
                                    let operacion=req.body.color;
                                    let user_id=req.body.id_usuario;
                                  
                                    var estado=0;

                                    if(operacion==="amarillo"){

                                      const mensaje='Si'
                                      res.send({mensaje}); 
                                      return;

                                    }

                                   const maices= await  Maiz2.find({user:user_id})

                                      amarillo=maices[0].amarillo;
                                      morado=maices[0].morado;
                                      blanco=maices[0].blanco;
                                      rojo=maices[0].rojo;

                                      if(operacion==="morado" && morado>0){
                                
                                        morado=morado-1;
                                        estado=1;
                                     }


                                     if(operacion==="blanco" && blanco>0){
                                        blanco=blanco-1;
                                        estado=2;
                                     }
 
                                     if(operacion==="rojo" && rojo>0){
                                       console.log('entra')
                                        rojo=rojo-1;
                                        estado=3
                                     }

                                     if(estado==0){
                                       return;
                                     }


                                    const dato={
                                      amarillo,
                                      blanco,                                     
                                      morado,
                                      rojo
                                  
                                    }



                                    try{

                                      
                                     await  Maiz2.update(condition,dato);
                                    res.send(dato); 

                                    }catch(err){
                                      return res.status(422).send(err.message)
                                    }
                                    
                                    
                                  })



















                                   router.get('/premios/:id',(req,res)=>{

                                  
                                    const user = {_id:req.params.id}

                                    Premio.find({user:user})
                                    .exec(function (err, maices) {
                                      if (err) return console.log(err);
                                      
                                      res.send(maices);
                                    });                            



                                   })


                                   router.put('/editar/maiz2/:id', async (req,res)=>{
                                    
                                    let amarillo=0,morado=0,blanco=0,rojo=0;

                                    let condition={_id:req.params.id};
                               
                                    let operacion=req.body.color;
                                    let user_id=req.body.id_usuario;
                                  
                                    var estado=0;

                            
                                    const maices= await  Maiz2.find({user:user_id})

                                    amarillo=maices[0].amarillo;
                                    morado=maices[0].morado;
                                    blanco=maices[0].blanco;
                                    rojo=maices[0].rojo;

                                    if(operacion=="morado" && amarillo>5 ){
                                      console.log('entra al morado')
                                       amarillo=amarillo-6;
                                       morado=morado+1;
                                       estado=1;
                                    }

                                    if(operacion=="blanco" &&morado>5){
                                       morado=morado-6;
                                       blanco=blanco+1;
                                       estado=2;
                                    }

                                    if(operacion=="rojo" && blanco>5){
                                       blanco=blanco-6
                                       rojo=rojo+1;
                                       estado=3;
                                    }



                                    if(estado==0){

                                      return;
                                    }


                                    const dato={
                                      amarillo,
                                      blanco,                                     
                                      morado,
                                      rojo
                                  
                                    }



                                    try{

                                      
                                     await  Maiz2.update(condition,dato);
                                    res.send(dato); 

                                    }catch(err){
                                      return res.status(422).send(err.message)
                                    }
                                    
                                    
                                  })


                                  router.put('/ganar/maiz/:id', async (req,res)=>{
                                    console.log('se invoca')


                                    let condition={_id:req.params.id};
                               
                                    let operacion=req.body.color;
                                    let user_id=req.body.id_usuario;


                                    const estrellas= await  Maiz.find({user:user_id})

                                    console.log('estrellas: '+estrellas)
                                    amarillo=estrellas[0].amarillo;
                                    morado=estrellas[0].morado;
                                    blanco=estrellas[0].blanco;
                                    rojo=estrellas[0].rojo;
                                    
                                    let  cantidad=req.body.cantidad;

                                    if(operacion=="morado"){
                                      
                                       morado=morado+cantidad;
                                    }

                                    if(operacion=="blanco" ){
                                 
                                       blanco=blanco+cantidad;
                                    }

                                    if(operacion=="rojo"){
                                
                                       rojo=rojo+cantidad;
                                    }

                                    if(operacion=="amarillo"){
                                    
                                      amarillo=amarillo+cantidad;
                                   }

                                    const dato={
                                      amarillo,
                                      blanco,                                     
                                      morado,
                                      rojo
                                  
                                    }

                                    const dato2={
                                      amarillo
                                    }



                                    try{

                                      
                                await  Maiz.update(condition,dato);

                               
                          
                                   
                               
                               
                                    res.send(dato); 

                                    }catch(err){
                                      console.log(err);
                                      return res.status(422).send(err.message)
                                    }
                                    
                                    
                                  })

                                  router.put('/ganar/maiz2/:id', async (req,res)=>{


                                    let condition={_id:req.params.id};
                               
                                    let operacion=req.body.color;
                                    let user_id=req.body.id_usuario;

                                    console.log('color : '+ operacion)
                                    const maices= await  Maiz2.find({user:user_id})
                                    console.log('maices Ganador: '+maices)

    
                                     let amarillo=maices[0].amarillo;
                            
                                    if(operacion=="amarillo"){
                                    
                                      amarillo=amarillo+1;
                                     }

                                     console.log('luego de asignar 1: '+amarillo)

                                    const dato={
                                      amarillo
                         
                                  
                                    }


                                    try{

                                                
                                     await Maiz2.update(condition,{$set:{amarillo:amarillo}})
                                 
                                    res.send(dato); 

                                    }catch(err){
                                      console.log(err);
                                      return res.status(422).send(err.message)
                                    }
                                    
                                    
                                  })

                           




                                  router.put('/ganar/maiz3/:id', async (req,res)=>{


                                    let condition={_id:req.params.id};
                               
                                    let operacion=req.body.color;
                                    let user_id=req.body.id_usuario;

                                    const maices= await  Maiz2.find({user:user_id})
                                    console.log('maices perdedor: '+maices)

    
                                     let amarillo=maices[0].amarillo;
                            
                                    if(operacion=="amarillo"){
                                    
                                      amarillo=amarillo+2;
                                     }

                                     console.log('luego de asignar 2: '+amarillo)

                                    const dato={
                                      amarillo
                         
                                  
                                    }


                                    try{

                                                
                                     await Maiz2.update(condition,{$set:{amarillo:amarillo}})
                                 
                                    res.send(dato); 

                                    }catch(err){
                                      console.log(err);
                                      return res.status(422).send(err.message)
                                    }
                                    
                                    
                                  })


                                  router.put('/user/:id',async (req,res)=>{
                                    
                                   let cadena = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                                   let rename='';
                                  let cambio=req.body.foto.substring(0,3);
                                  console.log(cambio);
                                  let foto_aux='';
                                    let foto='';

                                   if(cambio!="htt"){

                                    for(let i=1;i<=5;i++){

                                      rename+=cadena.charAt(Math.floor(Math.random() * cadena.length));
                                      
                                      
                                      }

                                      let file='./upload'+'/'+rename+'.png';

                                    fs.writeFile(file, req.body.foto, 'base64', (err) => {
                                      if (err) throw err
                               
                                    })           

                                    foto_aux = await cloudinary.v2.uploader.upload(file);
                                    console.log(foto_aux);
                                    foto=foto_aux.secure_url;
                               


                                  }else{
                                    foto=req.body.foto;

                                  }



                                    var condition={_id:req.params.id};
                                    


                                    const {email,nombre} = req.body;
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


                                  module.exports = router */