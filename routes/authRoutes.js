                                const express = require('express')
                                const mongoose = require('mongoose')
                                const jwt = require('jsonwebtoken')
                                const {jwtkey} = require('../keys')
                                const router = express.Router();
                                const User = mongoose.model('User');
                                const Maiz = mongoose.model('Maiz');
                                const Premio = mongoose.model('Premio');

                                const requireToken = require('../middleware/requireToken')

                                const passport = require ('passport');
                                const FacebookStrategy = require ('passport-facebook').Strategy;
                                const GoogleStrategy = require ('passport-google-oauth20').Strategy;
/*                                 const { facebook, google} = require ('../config');
 */



                         
                              


                                passport.serializeUser((user, done) => done(null, user));

                          
                                passport.deserializeUser((user, done) => done(null, user));

                                passport.use(new GoogleStrategy({
                                  clientID: "390484653598-7egpn92fieb83krkm49t68qh2gvai1vc.apps.googleusercontent.com", // Add your clientID
                                  clientSecret: "WxnPzf7zU63X5bVEDm-6BYFj", // Add the secret here
                                  callbackURL: '/auth/google/callback'
                                  }, (accessToken, refreshToken, profile, done) => {

                                  done(null, profile, accessToken );

                                  }))

                               


                                  passport.use(new FacebookStrategy({
                                    clientID: "1690675411093038", // Add your clientID
                                    clientSecret: "f586453d81e7285f7e396ff228cdeaf8", // Add the secret here
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
                                      /*   console.log('primer error: '+err)
                                        const error='el Correo ya se encuentra registrado';
                                        console.log(error)
                                        res.send(error) */



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

                                      res.send('sus datos estan seguros');

                                    })

                                  router.get('/auth/google', passport.authenticate('google', {
                                    scope: ['profile', 'email'],
                                    }));
                                
                                    router.get('/auth/google/callback', passport.authenticate('google'), async(req, res, next) => {

                                      const email=req.user.emails[0].value;
                                      const nombreaux=req.user.name.givenName.split(" ",1);
                                      const password="";
                                      const foto=req.user.photos[0].value;
                                      
                                      const nombre=nombreaux+' ';
                                      console.log(nombre)
                                        try{
                                        const user = new User({email,nombre,password,foto});
                                        let guarda= await  user.save();

                                        if(guarda){
                                          const maiz=new Maiz({
                                            amarillo:'0',
                                            morado:'0',
                                            blanco:'0',
                                            rojo:'0',
                                            user:user._id
                                          });
                                           await maiz.save();
                                        }
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



                                      
                                    /* return res.redirect("OAuthLogin://login?id=" + req.user.id); */
                                    });








                                  router.post('/signup',async (req,res)=>{
                                

                                    const {email,nombre,password,foto} = req.body;
                                      try{
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
                                        }



                                        const token = jwt.sign({userId:user._id},jwtkey)
                                        res.send({token})

                                      }catch(err){
                                        const error='el Correo ya se encuentra registrado';
                                        console.log(error)
                                        res.send(error)
                                      }
                                      
                                      
                                  })



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

                                       cupon=req.body.cupon;
                                       maiz=req.body.maiz;
                                        operacion=req.body.color;

                                       amarillo=req.body.amarillo;
                                      morado=req.body.morado;
                                       blanco=req.body.blanco;
                                       rojo=req.body.rojo;
                                      
 
                                     if(operacion=="morado" && morado>maiz && cupon>0 ){
                                       console.log('entra');
                                      morado=morado-maiz;
                                     }
 
                                     if(operacion=="blanco" && blanco>maiz && cupon>0){
                                      console.log('entra');
                                      blanco=blanco-maiz;
                                     }
 
                                     if(operacion=="rojo" && rojo>maiz && cupon>0){
                                      console.log('entra');
                                        rojo=rojo-maiz;
                                     }
 
                                     if(operacion=="amarillo" && amarillo>maiz && cupon>0){
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


                                  router.get('/maiz/:id',(req,res)=>{

                                  
                                    const user = {_id:req.params.id}

                                    Maiz.find({user:user})
                                    .exec(function (err, maices) {
                                      if (err) return console.log(err);
                                      
                                      res.send(maices);
                                    });                            



                                   })


                                   router.get('/premios/:id',(req,res)=>{

                                  
                                    const user = {_id:req.params.id}

                                    Premio.find({user:user})
                                    .exec(function (err, maices) {
                                      if (err) return console.log(err);
                                      
                                      res.send(maices);
                                    });                            



                                   })


                                   router.put('/editar/maiz/:id', async (req,res)=>{
                                    

                                    let amarillo=0,morado=0,blanco=0,rojo=0;

                                    let condition={_id:req.params.id};
                               
                                    let operacion=req.body.color;

                                      amarillo=req.body.amarillo;
                                     morado=req.body.morado;
                                      blanco=req.body.blanco;
                                      rojo=req.body.rojo;
                                    console.log(operacion);

                                    if(operacion=="morado" && amarillo>6 ){
                                      console.log('entra al morado')
                                       amarillo=amarillo-6;
                                       morado=morado+1;
                                    }

                                    if(operacion=="blanco" &&morado>6){
                                       morado=morado-6;
                                       blanco=blanco+1;
                                    }

                                    if(operacion=="rojo" && blanco>6){
                                       blanco=blanco-6
                                       rojo=rojo+1;
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
                                      return res.status(422).send(err.message)
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