                                const express = require('express')
                                const mongoose = require('mongoose')
                                const jwt = require('jsonwebtoken')
                                const {jwtkey} = require('../keys')
                                const router = express.Router();
                                const User = mongoose.model('User');
                                const Maiz = mongoose.model('Maiz');
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
                                        await  user.save( function(err){

                                            if(err){
                                              res.send('si hay error')
                                              return handleError(err);
                                            }else{
                                              const maiz=new Maiz({
                                                amarillo:'0',
                                                morado:'0',
                                                blanco:'0',
                                                rojo:'0',
                                                user:user._id
                                              });
                                                maiz.save(function (err) {
                                                  if (err) return handleError(err);
                                                
                                                });
                                            }
                                          

                                        });

                                        const token = jwt.sign({userId:user._id},jwtkey)
                                                                                   res.send('aun genera el token')

                                       
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
                                       
                                        await  user.save((error)=>{

                                          if(error){
                                            return;
                                          }else{
                                            const maiz=new Maiz({
                                              amarillo:'0',
                                              morado:'0',
                                              blanco:'0',
                                              rojo:'0',
                                              user:user._id
                                            });
                                              maiz.save();
                                          }
                                        

                                      });
                                        
                                        const token = jwt.sign({userId:user._id},jwtkey)
                                        res.send({token})

                                      }catch(err){
                                        const error='el Correo ya se encuentra registrado';
                                        console.log(error)
                                        res.send(error)
                                      }
                                      
                                      
                                  })

                                  router.get('/maiz/:id',(req,res)=>{

                                  
                                    const user = {_id:req.params.id}

                                    Maiz.find({user:user})
                                    .exec(function (err, maices) {
                                      if (err) return handleError(maices);
                                      console.log(maices[0].amarillo)
                                      res.send(maices);
                                    });                            



                                   })


                                   router.put('/editar/maiz/:id', async (req,res)=>{
                                    

                                    var amarillo,morado,blanco,rojo;

                                    var condition={_id:req.params.id};
                               
                                    var operacion=req.body.color;

                                      amarillo=req.body.amarillo;
                                     morado=req.body.morado;
                                      blanco=req.body.blanco;
                                      rojo=req.body.rojo;
                                    console.log(operacion);

                                    if(operacion=="morado"){
                                      console.log('entra al morado')
                                       amarillo=amarillo-6;
                                       morado=morado+1;
                                    }

                                    if(operacion=="blanco"){
                                       morado=morado-6;
                                       blanco=blanco+1;
                                    }

                                    if(operacion=="rojo"){
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