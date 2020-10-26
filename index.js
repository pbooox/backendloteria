const express  = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express();
const server=require('http').Server(app);
const io = require('socket.io')(server);
app.set('port', process.env.PORT || 3000);


server.listen(process.env.PORT || 3000)


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
    console.log("conectado a mongo")
})

mongoose.connection.on('error',(err)=>{
    console.log("this is error",err)
})



let jugadores={};
let clienteNo=0;
let cadena = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let room='';

let existe= 0;
let Salas = [];
let Salaspublicas=[];

let segundos=60;


io.on('connection',connected);




/* function secondPassed(temp) {

    const minutes = Math.trunc(segundos/60); //calcula el número de minutos
    const remainingSeconds = segundos % 60; //calcula los segundos restantes
    //si los segundos usan sólo un dígito, añadimos un cero a la izq

    const dat={minutes:minutes,remainingSeconds:remainingSeconds}
  


    socket.to(temp).emit('cuenta',dat )
    if (segundos == 0) { 
      
      socket.to(temp).emit('cuenta',segundos)



    } else { 
      segundos--; 
    } 
  }  */


                    function connected(socket){
   


                                            socket.on('jugador',data=>{
                                            
                                        


                                                jugadores[socket.id] = data.nombre;
                                               socket.username=data.nombre;
                                                room='';


                                            
                                                for(let i=1;i<=6;i++){

                                                    room+=cadena.charAt(Math.floor(Math.random() * cadena.length));
                                                    
                                                    
                                                    }
                                                Salas.push(room);
                                                socket.room=room;
                                                socket.join(room)

                                                        socket.emit('join',room);
                                                  console.log(`${socket.username} ha creado la sala: ${room} `)
                                                  console.log('cantidad de jugadores: '+io.nsps['/'].adapter.rooms[room].length);
                                         
                                           

                               


                                            })




                                                socket.on('jugadores',data=>{



                                                    jugadores[socket.id] = data.nombre;
                                                    socket.username=data.nombre;
                    
                                                // Verificar si existe el cuarto
                                                
                                                let index=0;
                                                let temp='';
                                                for(index; index < Salas.length; index++){
                                                if(Salas[index] == data.codigo ){
                                                    existe=existe+1;
                                                    temp = data.codigo
                                                    // Sí existe, fin del ciclo
                                                    break;
                                                }
                                                }
                    
                                                    if(existe==0){
                                                    
                                                    const mensaje='Código de sala incorrecto'    
                                                    socket.emit('eventoerror',mensaje)

                                                    }
                                                  
                    
                                               /*  socket.join(temp) */
                                               socket.room=temp;
                                                socket.join(temp, (err) => {
                                                    if(err) {
                                                      return console.log(err);
                                                    }
                                                   
                                                    /* io.to(temp).emit('mensaje', socket.username) */
                    
                    
                                                   return socket.to(temp).emit('mensaje', socket.username)
                                                    
                    
                                                    })
                                                  
                                                       
                    
                                                
                                                    const cantjug=io.nsps['/'].adapter.rooms[temp].length;
                                                console.log(`${socket.username} se ha unido a la sala: ${temp} `)
                    
                                                console.log('cantidad de jugadores: '+cantjug);
                    

                                            
                                                if(cantjug==1){
                                                    const room = io.sockets.adapter.rooms[temp];
                                                    room.time=60;
                                                 const  intervalo= setInterval(function() {

                                                                
                                                                
                                                                if (typeof room.time !== 'undefined') {
                                                                    if (room.time <= 0) {

                                                                        cartas(temp);
                                                                        clearInterval(intervalo);
                                                                        
                                                                       /*  room.time = 0; */
                                                                        // emit time up
                                                                    } else {

                                                                        room.time--;
                                                                        io.to(temp).emit('cuenta',room.time )

                                                                        
                                                                        // emit time
                                                                    }
                                                                    console.log(room);
                                                                }
                                                            
                                                        
                                                    }, 1000);


                                                   

                                                }


                    
                                                




                                                })





                                                socket.on('publico',data=>{

                                                    let salroom=data.sala
                                                    jugadores[socket.id] = data.nombre;
                                                    socket.username=data.nombre;

                                                    Salaspublicas.push(salroom);
                                                    socket.room=salroom;

                                                 

                                                  
                                                    socket.join(salroom, (err) => {
                                                        if(err) {
                                                          return console.log(err);
                                                        }
                                                       
                                                        /* io.to(temp).emit('mensaje', socket.username) */
                        
                        
                                                       return socket.to(salroom).emit('mensaje', socket.username)
                                                        
                        
                                                        })
                                                      
                                                           
                        
                                                    
                                                        const cantjug=io.nsps['/'].adapter.rooms[salroom].length;
                                                    console.log(`${socket.username} se ha unido a la sala: ${salroom} `)
                        
                                                    console.log('cantidad de jugadores: '+cantjug);


                                                    socket.broadcast.emit ( 'cantidad' , {cantidad:cantjug,sala:salroom});

    
                                                
                                                    if(cantjug==2){
                                                        const room = io.sockets.adapter.rooms[salroom];
                                                        room.time=60;
                                                        room.act=1; // para el room.array=[] de tarjetarandom
                                                     const  intervalo= setInterval(function() {
    
                                                                    
                                                                    
                                                                    if (typeof room.time !== 'undefined') {
                                                                        if (room.time <= 0) {
    
                                                                            cartas(salroom);
                                                                            clearInterval(intervalo);
                                                                            
                                                                           /*  room.time = 0; */
                                                                            // emit time up
                                                                        } else {
    
                                                                            room.time--;
                                                                            io.to(salroom).emit('cuenta',room.time )
    
                                                                            
                                                                            // emit time
                                                                        }
                                                                        console.log(room);
                                                                    }
                                                                
                                                            
                                                        }, 1000);
    
    
                                                       
    
                                                    }





                                                })



                                                    function cartas(temp){


                                                        


                                                            console.log('entra al segundo intervalo')
                                                            const room2 = io.sockets.adapter.rooms[temp];

                                                          room2.time=6;
                                                       const  intervalo2= setInterval(function() {
      
                                                                      
                                                                      
                                                                      if (typeof room2.time !== 'undefined') {
                                                                          if (room2.time <= 0) {
      
                                                                             /*  clearInterval(intervalo); */
                                                                                if(room2.time==0){
                                                                                    CartasRandom(temp);
                                                                                }
                                                                                room2.time--

                                                                                if(room2.time==-4){
                                                                                    
                                                                                    room2.time = 6;
                                                                                }

                                                                              /* setTimeout(() => {
                                                                                  room2.time = 11;
                                                                              }, 6000); */
      
                                                                          
                                                                          } else {
                                                                              room2.time--;
                                                                              io.to(temp).emit('movecard',room2.time )


                                                                              
                                                                          }
                                                                          console.log(room2);
                                                                      }
                                                                  
                                                              
                                                          }, 1000);
      
      
                                                          


                                                    }




                                                    socket.on('Random',data=>{

                                                    const cantjug=io.nsps['/'].adapter.rooms[data].length;

                                                    const room = io.sockets.adapter.rooms[data];

                                                        if(cantjug==1){
                                                            room.array=[];
                                                             room.existe=false;
                                                        }


                                                        const rand= setInterval(() => {
                                                            
                                                            let target=0+Math.floor(11*Math.random())
                                                       
    
    
                                                            for(let i=0;i<room.array.length;i++){
                                                                if(room.array[i] == target){
                                                                    room.existe = true;
                                                                    break;
                                                                }
                                                              }
                                                              if(!room.existe){
                                                                  room.array.push(target);
                                                                socket.emit('target',target);
                                                                clearInterval(rand);
                                                                console.log(target);
                                                              }
                                                                                                               
                                        
                                                                    

                                                        }, 200);
                                                       



                                            
                                                    })


                                                    function CartasRandom (data){

    
                                                        const room = io.sockets.adapter.rooms[data];
                                                        
                                                            if(room.act==1){
                                                                room.act=2;
                                                                room.arrary2=[];
                                                            }
    
                                                            room.existe2=false;

                                                            const rand= setInterval(() => {
                                                                
                                                                let target=0+Math.floor(53*Math.random())
                                                            
        
        
                                                                for(let i=0;i<room.arrary2.length;i++){
                                                                    if(room.arrary2[i] == target){
                                                                        room.existe2=true;
                                                                        break;
                                                                    }
                                                                  }
                                                                  if(! room.existe2){
                                                                      room.arrary2.push(target);
                                                                      io.to(data).emit('target2',target);
                                                                    clearInterval(rand);
                                                                    console.log(room.arrary2);
                                                                  }
                                                                                                                   
                                            
                                                                        
    
                                                            }, 200);
                                                           
    
    
    
                                                
                                                        }


                                            socket.on('disconnect',data=>{

                                               delete jugadores[socket.id]
/*                                                socket.to(temp).emit('desconectados', socket.username)
 */                                                console.log("Adios "+socket.username);
                                                socket.leave(socket.room);
        
                                                
        
        
                                                })



}
 
      
     
    
app.get('/',requireToken,(req,res)=>{
    res.send({id:req.user.id,email:req.user.email,nombre:req.user.nombre,foto:req.user.foto})
})




/* app.listen(app.get('port'),()=>{

    
    console.log(`Server on port ${app.get('port')}`);
}) */













  










