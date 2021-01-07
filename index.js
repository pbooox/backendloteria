                                const express  = require('express')
                                const bodyParser = require('body-parser')
                                const mongoose = require('mongoose')
                                const passport = require('passport');

                                const app = express();

                                app.use(passport.initialize());

                                const server=require('http').Server(app);
                                const io = require('socket.io')(server,{pingInterval:1000,pingTimeout:6000});
                                app.set('port', process.env.PORT || 3000);


                                server.listen(process.env.PORT || 3000)


                                /* const PORT = 3000 */
                                const {mogoUrl} = require('./keys')


                                require('./models/User');
                                require('./models/Maiz');
                                require('./models/Premio');

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



                                var jugadores={};
                                let clienteNo=0;
                                var cadena = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                                var room='';

                                var existe= 0;
                                var Salas = [];
                                var Salasprivadas=[];

                                let segundos=60;


                                io.on('connection',connected);






                    function connected(socket){
   




                                            socket.on('envioreal',()=>{

                                                console.log(Salas);

                                                if(Salas.length){
                                                    Salas.forEach(elemento => {
                                                       
                                                        if(io.nsps['/'].adapter.rooms[elemento]==="undefined"){
                                                            return;
                                                        }
                                                        const cantjug=io.nsps['/'].adapter.rooms[elemento].length;
                                                        const roomm = io.sockets.adapter.rooms[elemento];
                                              
                                                        socket.emit ( 'cantidad' , {cantidad:cantjug,sala:roomm.nombremesa,cod:elemento,es:true});
    
    
    
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
                                                    roomm.arrary_cartas_restauradas=[];
                                                    roomm.figuras=data.figuras;
                                                    roomm.estado_sala=data.estado;
                                                    roomm.color=data.color;
                                                    roomm.pasadas=0;
                                                    const tarjeta_aleatorio=[0,1,2,3,4,5,6,7,8,9,10,11];
                                                    
                                                    const cartas_juego=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,
                                                    39,40,41,42,43,44,45,46,47,48,49,50,51,52,53
                                                    ]

                                                    cartas_juego.sort(function() { return Math.random() - 0.5 });

                                                   
                                                    tarjeta_aleatorio.sort(function() { return Math.random() - 0.5 });

                                                    roomm.juego_tablero=cartas_juego;
                                                    roomm.escoge_carton= tarjeta_aleatorio;
                                                        console.log('tiempo enviado: '+roomm.tiempo)
                                                        socket.emit('join',room);

                                                        const cantjug=io.nsps['/'].adapter.rooms[room].length;

                                                        socket.broadcast.emit ( 'cantidad' , {cantidad:cantjug,sala:roomm.nombremesa,cod:room,es:true});

                                                  console.log(`${socket.username} ha creado la sala: ${room} `)
                                                  console.log('cantidad de jugadores: '+io.nsps['/'].adapter.rooms[room].length);
                                                


            

                                            })




                                            socket.on('nombremesa',()=>{

                                                
                                                const sala= socket.room;
                                                if(io.nsps['/'].adapter.rooms[sala]==undefined){
                                                console.log('entra al cerrar')

                                                    return;
                                                   } 
                                                const roomm = io.sockets.adapter.rooms[sala];
                                               
                                                 socket.emit('recibonombre',{mesa:roomm.nombremesa,estado_mesa:roomm.estado_sala})   
                                                    //falso sala publica
                                                    //verdadero sala privada

                                            })

                                                socket.on('jugadores',data=>{

                                                    if(io.nsps['/'].adapter.rooms[data.codigo]==undefined){
                                                        const mensaje='Código de sala incorrecto'    
                                                        socket.emit('eventoerror',mensaje)

                                                        return;
                                                       } 


                                                    const cantjug=io.nsps['/'].adapter.rooms[data.codigo].length;



                                                    if(cantjug>3){
                                                        const mensaje1='Sala llena.'  
                                                       
                                                        socket.emit('eventoerror',mensaje1)       
                                                         return;
                                                    }


                                                 
                    
                                                // Verificar si existe el cuarto
                                                let index=0;
                                                let temp='';
                                                existe=0;
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
                                                    return;
                                                    }
                                                  


                    
                                               /*  socket.join(temp) */
                                               console.log('en sala privada si tiene codigo antes del join'+temp);
                                               jugadores[socket.id] = data.nombre;
                                               socket.username=data.nombre;
                                               socket.room=temp;
                                               const roomm = io.sockets.adapter.rooms[temp];

                                               
                                                socket.join(temp, (err) => {
                                                    if(err) {
                                                      return console.log(err);
                                                    }
                                                   
                                                    /* io.to(temp).emit('mensaje', socket.username) */
                    
                    
                                                  console.log('en sala pivada si tiene codigo'+temp);
                                                  socket.to(temp).emit('mensaje', socket.username) 
                                                  socket.emit('salaexistente')
                                                    })
                                                  
                                                       
                    
                                                    const cantjugador=io.nsps['/'].adapter.rooms[temp].length;
                                                console.log(`${socket.username} se ha unido a la sala: ${temp} `)
                    
                                                console.log('cantidad de jugadores: '+cantjug);
                    
                                               

                                            
                                                if(cantjugador==2){
                                                 
                                                if(roomm.pasadas==0){
                                                    roomm.pasadas=1;
                                                    juego(temp);
                                                }
                                                 

                                                   

                                                }


                    
                                                




                                                })





                                                socket.on('publico',data=>{

                                                    //colocar condicional para verificar el arreglo de
                                                    //las salas publicas ya que se debe eliminar cuando falten 20 segundo
                                                    // de esta manera si alguien quiere entrar regresar un mensaje de el juego ha iniciado

                                                    let salroom=data.sala
                                                    if(io.nsps['/'].adapter.rooms[salroom]==undefined){
                                                        const mensaje1='Sala Eliminada.'  
                                                         socket.emit('lleno',mensaje1) 
                                                        return;
                                                       } 

                                                    const cantjug=io.nsps['/'].adapter.rooms[salroom].length;
                                                    if(cantjug>3){
                                                        const mensaje1='Sala llena.'  

                                                         socket.emit('lleno',mensaje1) 
                                                        return;
                                                    }


                                                   

                                                    let index=0;
                                                    let temp='';
                                                    existe=0;
                                                    for(index; index <Salas.length; index++){
                                                    if(Salas[index] == salroom){
                                                        existe=existe+1;
                                                        temp=salroom;
                                                        // Sí existe, fin del ciclo
                                                        break;
                                                    }
                                                    }



                                                    if(existe==0){
                                                    
                                                        const mensaje='El juego ha iniciado.'  
                                                        console.log('ya se eliminó')  
                                                         socket.emit('iniciado',mensaje) 
                                                         
                                                         return;
                                                        }

                                                        jugadores[socket.id] = data.nombre;
                                                        socket.username=data.nombre;
                                                        socket.room=salroom;
                                                    const roomm = io.sockets.adapter.rooms[salroom];

                                                          

                                                  
                                                    socket.join(salroom, (err) => {
                                                        if(err) {
                                                          return console.log(err);
                                                        }
                                                       
                                                        /* io.to(temp).emit('mensaje', socket.username) */
                        
                        
                                                      socket.to(salroom).emit('mensaje', socket.username)
                                                       return socket.emit('salaexistente')

                        
                                                        })
                                                      
                                                           
                                                        const cantjugadores=io.nsps['/'].adapter.rooms[salroom].length;

                                                    
                                                    console.log(`${socket.username} se ha unido a la sala: ${salroom} `)
                        


                                                    socket.broadcast.emit ( 'aumentarcantidad' , {cantidad:cantjugadores,sala:roomm.nombremesa,cod:salroom});

    
                                                        
                                                    if(cantjugadores==2){
                                                        
                                                        if(roomm.pasadas==0){
                                                            roomm.pasadas=1;
                                                            juego(salroom);
                                                        }
                                                        
                                                       
    
                                                    }

                                                    





                                                })



                                       
                                            

                                                    function juego(salroom){

                                                        const room = io.sockets.adapter.rooms[salroom];
                                                      
                                                        room.act=1; // para el room.array=[] de tarjetarandom
                                                     const  intervalo= setInterval(function() {
                                                        

                                                        room.minutes = Math.round((room.tiempo - 30)/60); //calcula el número de minutos
                                                        room.remainingSeconds = room.tiempo % 60; //calcula los segundos
                                                                    
                                                                    if (typeof room.tiempo !== 'undefined') {
                                                                        if (room.tiempo==0) {
                                                                            console.log('llegó a 0 seconds: '+room.remainingSeconds)

                                                                            console.log('llegó a 0 room.tiempo: '+room.tiempo)
                                                                            cartas(salroom);
                                                                            clearInterval(intervalo);
                                                                            
                                                                           /*  room.time = 0; */
                                                                            // emit time up
                                                                        } else {
    
                                                                            console.log('room.tiempo: '+room.tiempo);
                                                                        console.log('room.minutes: '+room.minutes);
                                                                        console.log('room.remainseconds: '+room.remainingSeconds)
                                                                            room.tiempo--;
                                                                            io.to(salroom).emit('cuenta',{minutos:room.minutes,segundo:room.remainingSeconds,seg:room.tiempo} )
                                                                            
                                                                            // emit time
                                                                        }

                                                                        if(room.tiempo==20){
                                                                            const index = Salasprivadas.indexOf(salroom);
                                                                            
                                                                            if (index > -1) {
                        
                                                                                Salasprivadas.splice(index, 1);
                        
                                                                             }


                                                                             const index2 = Salas.indexOf(salroom);
             
                                                                             if (index2 > -1) {
                         
                                                                                 Salas.splice(index, 1);
                                                                                 socket.broadcast.emit ( 'eliminasala' , {cantidad:0,sala:'no hay',cod:salroom});

                                                                              }
                                                                        }

                                                                        if(io.nsps['/'].adapter.rooms[salroom]==undefined){
                                                                            clearInterval(intervalo);
                                                                        }
/*                                                                         console.log(room);
 */                                                                    }
                                                                
                                                            
                                                        }, 1000);
    

                                                    }


                                                    function cartas(temp){


                                                        
                                                        if(io.nsps['/'].adapter.rooms[temp]==undefined){
                                                            //si llegara a pasar se podria mostrar un mensaje.
                                                            return;
                                                           } 

                                                            console.log('entra al segundo intervalo')
                                                            const room2 = io.sockets.adapter.rooms[temp];
                                                            
                                                            
                                                          room2.time=6;
                                                       room2.intervalo= setInterval(function() {
      
                                                                      
                                                                      
                                                                      if (typeof room2.time !== 'undefined') {

                                                                        if(io.nsps['/'].adapter.rooms[temp]==undefined){
                                                                            //si llegara a pasar se podria mostrar un mensaje.
                                                                            return;
                                                                           } 
                                                                        const cantjug=io.nsps['/'].adapter.rooms[temp].length;

                                                                            if(cantjug==1){
                                                                            io.to(temp).emit('sinjugador')
                                                                            clearInterval(room2.intervalo);
                                                                       
                                                                            io.of('/').in(temp).clients((error, socketIds) => { if (error) throw error; socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(temp)); }); 

                                                                                return;
                                                                            }

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
                                                                          if(io.nsps['/'].adapter.rooms[temp]==undefined){
                                                                            clearInterval(room2.intervalo);
                                                                        }
                                                                          console.log(room2.time);
                                                                       }
                                                                  
                                                              
                                                          }, 1000);
      
      
                                                          


                                                    }




                                                    socket.on('Random',data=>{

                                                       if(io.nsps['/'].adapter.rooms[data]==undefined){
                                                        return;
                                                       } 
                                                    const room = io.sockets.adapter.rooms[data];

                                                    const valor=room.escoge_carton;
                                                            if(valor=="undefined"){
                                                                return;
                                                            }
                                                     const eliminado=valor.shift();   
                                                        room.arrary_cartas_restauradas.push({id:socket.id,valor:eliminado});
                                                     console.log('array: '+valor);
                                                      console.log('eliminado: '+eliminado);
                                                            socket.emit('target',eliminado);
                                                     



                                            
                                                    })

                                                    
                                                    socket.on('Ganador',(data)=>{

                                                        const sala= socket.room;
                                                        if(io.nsps['/'].adapter.rooms[sala]==undefined){
                                                            return;
                                                           } 
                                                        const room = io.sockets.adapter.rooms[sala];
                                                      
                                                        if(room.color=="undefined"){
                                                            return;
                                                        }

                                                     socket.to(sala).emit('loteria',{nombre:socket.username,foto:data.foto,ganador:false,color:room.color});//enviar el mensaje del ganador a todos menos al ganador XD
                                                             socket.emit('loteria',{nombre:socket.username,foto:data.foto,ganador:true,color:room.color})
                                                     io.of('/').in(sala).clients((error, socketIds) => { if (error) throw error; socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(sala)); }); 
 
    
                                                            })

                                                    function CartasRandom (data){

                                                        if(io.nsps['/'].adapter.rooms[data]==undefined){
                                                            return;
                                                           } 
                                                        const room = io.sockets.adapter.rooms[data];
                                                        if(room.juego_tablero==="undefined"){
                                                            return;
                                                        }
                                                        const valor= room.juego_tablero;
                                                        console.log('tamaño de arreglo: '+valor.length);
                                                        if(valor.length===0){
                                                            clearInterval(room.intervalo);
                                                            io.to(data).emit('perdieron');
                                                            return;
                                                        }else{
                                                        

                                                        const eliminado=valor.shift();
                                                            console.log('eliminado en juego: '+eliminado);
                                                            room.ale=eliminado;
                                                       /*  io.to(data).emit('movecard',{target:eliminado,estado:true}); */

                                                        }
                                                           
    
    
    
                                                
                                                        }

                                                        function valor(data,target){

                                                            io.to(data).emit('movecard',{target:target,estado:true});

                                                        }



                                                    socket.on('Emoji',()=>{

                                                    const sala= socket.room;
                                                     socket.to(sala).emit('emoji', socket.username);



                                                        })

                                                        socket.on('figura',()=>{

                                                            const sala= socket.room;
                                                            const roomm = io.sockets.adapter.rooms[sala];

                                                             socket.emit('cantidad_figura',roomm.figuras);
        
        
        
                                                                })


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
                                                                     socket.broadcast.emit ( 'eliminasala' , {cantidad:0,sala:'no hay',cod:sala});
             
                                                                  }
             
                                                             }else{
                                                                 const cantjug=io.nsps['/'].adapter.rooms[sala].length;

                                                                 roomm.arrary_cartas_restauradas.map(data=>{

                                                                    if(data.id==socket.id){

                                                                        roomm.escoge_carton.push(data.valor);
                                                                        console.log('eliminado y restaurado: '+ data.valor);
                                                                        let index = roomm.arrary_cartas_restauradas.findIndex(item => item.id ===socket.id);

                                                                        if(index > -1){
                                                                            roomm.arrary_cartas_restauradas.splice(index, 1);
                                                                          }            
                                                                    }

                                                                 })

                                                                 console.log('nuevo: '+ roomm.escoge_carton)

                                                              /*    let message=`${socket.username} abandonó la partida 🤨`
                                                                 socket.to(sala).emit('abandonar', message)
                                                                  */

                                                                 socket.broadcast.emit ('aumentarcantidad', {cantidad:cantjug,sala:roomm.nombremesa,cod:sala});
             
                                                             }
                                                         }
                                                       

                                                         if(Salasprivadas.length){

                                                   

                                                            if(io.nsps['/'].adapter.rooms[sala]==undefined){
         
                                                             const index = Salasprivadas.indexOf(sala);
         
                                                             if (index > -1) {
         
                                                                 Salasprivadas.splice(index, 1);
         
                                                              }
         
                                                         }else{

                                                             roomm.arrary_cartas_restauradas.map(data=>{

                                                                if(data.id==socket.id){

                                                                    roomm.escoge_carton.push(data.valor);
                                                                    console.log('eliminado y restaurado: '+ data.valor);
                                                                    let index = roomm.arrary_cartas_restauradas.findIndex(item => item.id ===socket.id);

                                                                    if(index > -1){
                                                                        roomm.arrary_cartas_restauradas.splice(index, 1);
                                                                      }            
                                                                }

                                                             })

                                                             console.log('nuevo: '+ roomm.escoge_carton)

                                                         /*     let message=`${socket.username} abandonó la partida 🤨`
                                                             socket.to(sala).emit('abandonar', message) */
                                                             

         
                                                         }
                                                     }
                                                   
                                                          
                                                            
                                                            
            
            
                                                          
                                                             
                     
                     
                                                             })


                                            socket.on('disconnect',data=>{

                                               delete jugadores[socket.id]
                                               const sala= socket.room;
                                               let message=`${socket.username} se desconectó por mala conexión 😢`

                                               socket.to(sala).emit('abandonar', message)
                                               socket.emit('usuariodesconectado');
                                               console.log(socket.username + ' salió, error 404')
                                               const roomm = io.sockets.adapter.rooms[sala];
                                               console.log(roomm);
                                                   
                                                   socket.leave(sala);


                                                   if(Salas.length){

                                                   

                                                    if(io.nsps['/'].adapter.rooms[sala]==undefined){
 
                                                     const index = Salas.indexOf(sala);
 
                                                     if (index > -1) {
 
                                                         Salas.splice(index, 1);
                                                         socket.broadcast.emit ( 'eliminasala' , {cantidad:0,sala:'no hay',cod:sala});
 
                                                      }
 
                                                 }else{
                                                     const cantjug=io.nsps['/'].adapter.rooms[sala].length;

                                                     roomm.arrary_cartas_restauradas.map(data=>{

                                                        if(data.id==socket.id){

                                                            roomm.escoge_carton.push(data.valor);
                                                            console.log('eliminado y restaurado: '+ data.valor);
                                                            let index = roomm.arrary_cartas_restauradas.findIndex(item => item.id ===socket.id);

                                                            if(index > -1){
                                                                roomm.arrary_cartas_restauradas.splice(index, 1);
                                                              }            
                                                        }

                                                     })

                                                     console.log('nuevo: '+ roomm.escoge_carton)

                                                  /*    let message=`${socket.username} abandonó la partida 🤨`
                                                     socket.to(sala).emit('abandonar', message)
                                                      */

                                                     socket.broadcast.emit ('aumentarcantidad', {cantidad:cantjug,sala:roomm.nombremesa,cod:sala});
 
                                                 }
                                             }
                                           

                                             if(Salasprivadas.length){

                                       

                                                if(io.nsps['/'].adapter.rooms[sala]==undefined){

                                                 const index = Salasprivadas.indexOf(sala);

                                                 if (index > -1) {

                                                     Salasprivadas.splice(index, 1);

                                                  }

                                             }else{

                                                 roomm.arrary_cartas_restauradas.map(data=>{

                                                    if(data.id==socket.id){

                                                        roomm.escoge_carton.push(data.valor);
                                                        console.log('eliminado y restaurado: '+ data.valor);
                                                        let index = roomm.arrary_cartas_restauradas.findIndex(item => item.id ===socket.id);

                                                        if(index > -1){
                                                            roomm.arrary_cartas_restauradas.splice(index, 1);
                                                          }            
                                                    }

                                                 })

                                                 console.log('nuevo: '+ roomm.escoge_carton)

                                             /*     let message=`${socket.username} abandonó la partida 🤨`
                                                 socket.to(sala).emit('abandonar', message) */
                                                 


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













  










