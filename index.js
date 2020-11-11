const express  = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express();
const server=require('http').Server(app);
const io = require('socket.io')(server);
app.set('port', process.env.PORT || 4000);


 server.listen(process.env.PORT || 4000)


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
    console.log("conectado a mongo: "+ app.set('port'))
})

mongoose.connection.on('error',(err)=>{
    console.log("error: ",err)
})



let jugadores={};
let clienteNo=0;
let cadena = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let room='';

let existe= 0;
let Salas = [];
let Salasprivadas=[];

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
   




                                            socket.on('envioreal',()=>{

                                                console.log(Salas);

                                                if(Salas.length){
                                                    Salas.forEach(elemento => {
                                                       
                                                        const cantjug=io.nsps['/'].adapter.rooms[elemento].length;
                                                        const roomm = io.sockets.adapter.rooms[elemento];
                                              
                                                        socket.emit ( 'cantidad' , {cantidad:cantjug,sala:roomm.nombremesa,cod:elemento});
    
    
    
                                                       });
                                                }
                                                       




                                            })


                                            socket.on('jugador',data=>{
                                            
                                    
                                                jugadores[socket.id] = data.nombre;
                                                //guarda el nombre de manera global
                                               socket.username=data.nombre;
                                                room='';


                                            
                                                for(let i=1;i<=6;i++){

                                                    room+=cadena.charAt(Math.floor(Math.random() * cadena.length));
                                                    
                                                    
                                                    }

                                                    if(data.estado===false){
                                                        console.log('entra a publico');
                                                        Salas.push(room);
                                                    }else{
                                                        console.log('entra a privado');

                                                        Salasprivadas.push(room);
                                                    }
                                                

                                                //guarda la sala de manera global
                                                socket.room=room;
                                                socket.join(room)


                                                const roomm = io.sockets.adapter.rooms[room];
                                                    roomm.tiempo=data.tiempo*60;
                                                    roomm.nombremesa=data.nombresala;
                                                        console.log('tiempo enviado: '+roomm.tiempo)
                                                        socket.emit('join',room);

                                                        const cantjug=io.nsps['/'].adapter.rooms[room].length;

                                                        socket.broadcast.emit ( 'cantidad' , {cantidad:cantjug,sala:roomm.nombremesa,cod:room});

                                                  console.log(`${socket.username} ha creado la sala: ${room} `)
                                                  console.log('cantidad de jugadores: '+io.nsps['/'].adapter.rooms[room].length);
                                         

            

                                            })




                                                socket.on('jugadores',data=>{



                                                    jugadores[socket.id] = data.nombre;
                                                    socket.username=data.nombre;
                    
                                                // Verificar si existe el cuarto
                                                
                                                let index=0;
                                                let temp='';
                                                for(index; index <Salasprivadas.length; index++){
                                                if(Salasprivadas[index] == data.codigo ){
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

                                                    
                                                 const  intervalo= setInterval(function() {

                                                                  room.minutes = Math.round((room.tiempo - 30)/60); //calcula el número de minutos
                                                                  room.remainingSeconds = room.tiempo % 60; //calcula los segundos
                                                                
                                                                if (typeof room.tiempo !== 'undefined') {
                                                                    if (room.tiempo <= 0) {

                                                                        cartas(temp);
                                                                        clearInterval(intervalo);
                                                                        
                                                                       /*  room.time = 0; */
                                                                        // emit time up
                                                                    } else {

                                                                        room.tiempo--;
                                                                        io.to(temp).emit('cuenta',{minutos:room.minutes,segundo:room.remainingSeconds,seg:room.tiempo} )

                                                                        
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

                                                   
                                                    socket.room=salroom;
                                                    const roomm = io.sockets.adapter.rooms[salroom];

                                                 

                                                  
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


                                                    socket.broadcast.emit ( 'cantidad' , {cantidad:cantjug,sala:roomm.nombremesa,cod:salroom});

    
                                                
                                                    if(cantjug==2){
                                                        const room = io.sockets.adapter.rooms[salroom];
                                                      
                                                        room.act=1; // para el room.array=[] de tarjetarandom
                                                     const  intervalo= setInterval(function() {
    
                                                        room.minutes = Math.round((room.tiempo - 30)/60); //calcula el número de minutos
                                                        room.remainingSeconds = room.tiempo % 60; //calcula los segundos
                                                                    
                                                                    if (typeof room.tiempo !== 'undefined') {
                                                                        if (room.tiempo <= 0) {
    
                                                                            cartas(salroom);
                                                                            clearInterval(intervalo);
                                                                            
                                                                           /*  room.time = 0; */
                                                                            // emit time up
                                                                        } else {
    
                                                                           
                                                                            room.tiempo--;
                                                                            io.to(salroom).emit('cuenta',{minutos:room.minutes,segundo:room.remainingSeconds,seg:room.tiempo} )
                                                                            
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
                                                            room2.arrary2=[];
                                                          room2.time=6;
                                                       const  intervalo2= setInterval(function() {
      
                                                                      
                                                                      
                                                                      if (typeof room2.time !== 'undefined') {
                                                                          if (room2.time <= 0) {
      
                                                                             /*  clearInterval(intervalo); */
                                                                                if(room2.time==0){
                                                                                   valor(temp,room2.ale);
                                                                                }
                                                                                room2.time--

                                                                                if(room2.time==-5){
                                                                                    
                                                                                    room2.time = 6;
                                                                                }

                                                                              /* setTimeout(() => {
                                                                                  room2.time = 11;
                                                                              }, 6000); */
      
                                                                          
                                                                          } else {


                                                                            if(room2.time==6){
                                                                                CartasRandom(temp);
                                                                            }
                                                                              room2.time--;
                                                                              io.to(temp).emit('movecard',{target:room2.time,estado:false} )


                                                                              
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
                                                        
                                                          
    
                                                            

                                                            const rand= setInterval(() => {
                                                                
                                                                room.existe2=false;

                                                                let target=0+Math.floor((53-room.arrary2.length)*Math.random())
                                                            
        
        
                                                                for(let i=0;i<room.arrary2.length;i++){
                                                                    if(room.arrary2[i] == target){
                                                                        room.existe2=true;
                                                                        break;
                                                                    }
                                                                  }
                                                                  if(! room.existe2){

                                                                      room.arrary2.push(target);
                                                                      room.ale=target
                                                                     /*  io.to(data).emit('movecard',{target:target,estado:true}); */
                                                                    clearInterval(rand);
                                                                    
                                                                  }
                                                                                                                   
                                            
                                                                        
    
                                                            }, 200);
                                                           
    
    
    
                                                
                                                        }

                                                        function valor(data,target){

                                                            io.to(data).emit('movecard',{target:target,estado:true});

                                                        }


                                                        socket.on('Salir',data=>{

                                                            delete jugadores[socket.id]
                                                            const sala= socket.room;

                                                            socket.to(sala).emit('abandonar', socket.username);
                                                            const roomm = io.sockets.adapter.rooms[sala];

                                                            // Sacar usuario del cuarto
                                                            socket.leave(sala);
                                                           
                                                            if(Salas.length){

                                                   

                                                                if(io.nsps['/'].adapter.rooms[sala]==undefined){
             
                                                                 const index = Salas.indexOf(sala);
             
                                                                 if (index > -1) {
             
                                                                     Salas.splice(index, 1);
                                                                     socket.broadcast.emit ( 'cantidad' , {cantidad:0,sala:'no hay',cod:sala});
             
                                                                  }
             
                                                             }else{
                                                                 const cantjug=io.nsps['/'].adapter.rooms[sala].length;
                                                                 let message=`${socket.username} abandonó la partida`
                                                                 socket.to(sala).emit('abandonar', message)
                                                                 
                                                                 socket.broadcast.emit ( 'cantidad' , {cantidad:cantjug,sala:roomm.nombremesa,cod:sala});
             
                                                             }
                                                         }
                                                       
                                                          
                                                            
                                                            
            
            
                                                          
                                                             
                     
                     
                                                             })


                                            socket.on('disconnect',data=>{

                                               delete jugadores[socket.id]
                                               const sala= socket.room;
                                               let message=`${socket.username} se desconectó por mala conexión :(`

                                               socket.to(sala).emit('abandonar', message)
                                               console.log(socket.username + ' salió, error 404')
                                               const roomm = io.sockets.adapter.rooms[sala];
                                               console.log(roomm);
                                                   
                                                   socket.leave(sala);


                                                   if(Salas.length){

                                                   

                                                   if(io.nsps['/'].adapter.rooms[sala]==undefined){

                                                    const index = Salas.indexOf(sala);

                                                    if (index > -1) {

                                                        Salas.splice(index, 1);
                                                        socket.broadcast.emit ( 'cantidad' , {cantidad:0,sala:'no hay',cod:sala});

                                                     }

                                                }else{
                                                    const cantjug=io.nsps['/'].adapter.rooms[sala].length;

                                                    socket.broadcast.emit ( 'cantidad' , {cantidad:cantjug,sala:roomm.nombremesa,cod:sala});

                                                }
                                            }
                                              
        
                                               
                                                })



}
 
      
     
    
                        app.get('/',requireToken,(req,res)=>{
                            res.send({id:req.user.id,email:req.user.email,nombre:req.user.nombre,foto:req.user.foto})
                        })




/* app.listen(app.get('port'),()=>{

    
    console.log(`Server on port ${app.get('port')}`);
}) */













  










