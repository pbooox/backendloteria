                                const express = require('express')
                                const mongoose = require('mongoose')
                                const jwt = require('jsonwebtoken')
                                const {jwtkey} = require('../keys')
                                const router = express.Router();
                                const User = mongoose.model('User');
                                const passport = require ('passport');
                                const FacebookStrategy = require ('passport-facebook').Strategy;
                                const GoogleStrategy = require ('passport-google-oauth20').Strategy;
/*                                 const { facebook, google} = require ('../config');
 */



                             /*    const transformFacebookProfile = (profile) => ({
                                  name: profile.name,
                                  avatar: profile.picture.data.url,
                                });

                                const transformGoogleProfile = (profile) => ({
                                  name: profile.displayName,
                                  avatar: profile.image.url,
                                });
 */
                         
                              /*   passport.use(new FacebookStrategy(facebook,
                               
                                   (accessToken, refreshToken, profile, done)
                                  => {done(null, profile, accessToken);}
                                ));
 */
                             
                               /*  passport.use(new GoogleStrategy(google,
                                   (accessToken, refreshToken, profile, done)
                                    => {done(null, transformGoogleProfile(profile._json))}
                                ));
 */
                                // Serialize user into the sessions


                                passport.serializeUser((user, done) => done(null, user));

                                // Deserialize user from the sessions
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
                                     
                                         /* res.send({token})  */
                                         res.redirect("OAuthLogin://login?id="+token); 

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
                                          res.redirect("OAuthLogin://login?id="+token); 
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
                                    // Google Oauth2 callback url
                                    router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/google' }), async(req, res, next) => {

                                      const email=req.user.emails[0].value;
                                      const nombre=req.user.name.givenName;
                                       nombre.split(" ",1);
                                      const password="";
                                      const foto=req.user.photos[0].value;
                                      //req.user.name.familyName
                                      //nombre.split(" ",1)
                                      //req.user.emails[0].value
                                      //req.user.photos[0].value
                                    

                                       try{
                                        const user = new User({email,nombre,password,foto});
                                        await  user.save();
                                        const token = jwt.sign({userId:user._id},jwtkey)
                                     
                                         /* res.send({token})  */
                                         res.redirect("oauthLogin://login?id="+token); 
                                         res.redirect('/')
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
                                          res.redirect("OAuthLogin://login?id="+token); 
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