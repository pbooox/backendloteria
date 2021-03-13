                                const express  = require('express')
                                const bodyParser = require('body-parser')
                          
                                const app = express();


                                const server=require('http').Server(app);
                                const io = require('socket.io')(server,{pingInterval:1000,pingTimeout:50000});
                                app.set('port', process.env.PORT || 3000);


                                server.listen(process.env.PORT || 3000)


                             


                             

                                app.use(bodyParser.json())

                             

                                app.get('/', function (req, res) {
                                    res.send('Servidor Lotería');
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

                                                            const index2 = Salas.indexOf(elemento);
             
                                                                             if (index2 > -1) {
                         
                                                                                 Salas.splice(index, 1);

                                                                              }
                                                            return;
                                                        }else{

                                                            try {
                                                                const cantjug=io.nsps['/'].adapter.rooms[elemento].length;
                                                                const roomm = io.sockets.adapter.rooms[elemento];
        
                                                                socket.emit ( 'cantidad' , {cantidad:cantjug,sala:roomm.nombremesa,cod:elemento,es:true,color:roomm.color,fondo:roomm.fondo});
            
                                                            } catch (error) {
                                                                return;
                                                            }
                                                             
                                                           

                                                        }


                                                  
                                                       
    
    
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
                                                    console.log('estrellas: '+data.estrellas)
                                                   
                                                const roomm = io.sockets.adapter.rooms[room];
                                                    roomm.tiempo=data.tiempo*60;
                                                    roomm.nombremesa=data.nombresala;
                                                    roomm.arrary_cartas_restauradas=[];
                                                    roomm.figuras=data.figuras;
                                                    roomm.estado_sala=data.estado;
                                                    roomm.color=data.color;
                                                     roomm.fondo=data.fondo;
                                                     roomm.cantidad_maiz=data.estrellas;
                                                    roomm.pasadas=0;
                                                    roomm.codigo_sala=room;
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

                                                        if(data.estado===false){
                                                        socket.broadcast.emit ( 'cantidad' , {cantidad:cantjug,sala:roomm.nombremesa,cod:room,es:true,color:roomm.color,fondo:roomm.fondo});
                                                        }
                                                  console.log(`${socket.username} ha creado la sala: ${room} `)
                                                  console.log('cantidad de jugadores: '+io.nsps['/'].adapter.rooms[room].length);
                                                


            

                                            })


                                                socket.on('jugadores_sala',()=>{
                                                    const sala= socket.room;

                                                    if(io.nsps['/'].adapter.rooms[sala]==undefined){

                                                        return;
                                                       } 
                                                    const cantjug=io.nsps['/'].adapter.rooms[sala].length;

                                                  socket.emit('cantidad_jugadores', cantjug) 


                                                })


                                            socket.on('nombremesa',()=>{

                                                
                                                const sala= socket.room;
                                                if(io.nsps['/'].adapter.rooms[sala]==undefined){

                                                    return;
                                                   } 
                                                const roomm = io.sockets.adapter.rooms[sala];
                                               
                                                 socket.emit('recibonombre',{mesa:roomm.nombremesa,estado_mesa:roomm.estado_sala})   
                                                    //falso sala publica
                                                    //verdadero sala privada

                                            })

                                                socket.on('jugadores',data=>{

                                                    if(io.nsps['/'].adapter.rooms[data.codigo]==undefined){
                                                        const mensaje='Código de mesa incorrecto'    
                                                        socket.emit('eventoerror',mensaje)

                                                        return;
                                                       } 


                                                    const cantjug=io.nsps['/'].adapter.rooms[data.codigo].length;



                                                    if(cantjug>11){
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
                                                    
                                                    const mensaje='Código de mesa incorrecto'    
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
                                                  socket.to(temp).emit('mensaje_configuracion', socket.username) 
                                                  socket.to(temp).emit('mensaje_random', socket.username) 
                                                  socket.to(temp).emit('mensaje_espera', socket.username) 

                                                  socket.emit('salaexistente')
                                                    })
                                                  
                                                       
                    
                                                    const cantjugador=io.nsps['/'].adapter.rooms[temp].length;
                    
                                                    socket.to(temp).emit('cantidad_jugadores', cantjugador); 

                                               

                                            
                                                if(cantjugador==3){
                                                 
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
                                                        const mensaje1='Mesa En Mantenimiento.'  
                                                         socket.emit('lleno',mensaje1) 
                                                        return;
                                                       } 

                                                    const cantjug=io.nsps['/'].adapter.rooms[salroom].length;
                                                    if(cantjug>11){
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
                        
                        
                                                      socket.to(temp).emit('mensaje_configuracion', socket.username) 
                                                  socket.to(temp).emit('mensaje_random', socket.username) 
                                                  socket.to(temp).emit('mensaje_espera', socket.username) 
                                                       return socket.emit('salaexistente')

                        
                                                        })
                                                      
                                                           
                                                        const cantjugadores=io.nsps['/'].adapter.rooms[salroom].length;

                                                    
                        


                                                    socket.broadcast.emit ( 'aumentarcantidad' , {cantidad:cantjugadores,sala:roomm.nombremesa,cod:salroom});
                                                    socket.to(temp).emit('cantidad_jugadores', cantjugadores); 

    
                                                        
                                                    if(cantjugadores==3){
                                                        
                                                        if(roomm.pasadas==0){
                                                            roomm.pasadas=1;
                                                            juego(salroom);
                                                        }
                                                        
                                                       
    
                                                    }

                                                    





                                                })



                                       
                                            

                                                    function juego(salroom){

                                                        const room = io.sockets.adapter.rooms[salroom];
                                                        if(io.nsps['/'].adapter.rooms[salroom]==undefined){

                                                            return;
                                                           } 
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
                                                                            io.to(salroom).emit('cuenta_random',{minutos:room.minutes,segundo:room.remainingSeconds,seg:room.tiempo} )

                                                                            // emit time
                                                                        }

                                                                        if(room.tiempo==20){


                                                                            if(Salasprivadas.length){

                                                                                const index = Salasprivadas.indexOf(salroom);
                                                                        
                                                                                   Salasprivadas.splice(index, 1);                            
                                                                                 

                                                                            }

                                                                       




                                                                             if(Salas.length){

                                                                             let otrodelete=Salas.indexOf(salroom)

                                    
                                                                             Salas.splice(otrodelete,1);
                                                                             socket.broadcast.emit ( 'eliminasala' , {cantidad:0,sala:'no hay',cod:salroom});
                                                                             }
                                                                          /*    const index2 = Salas.indexOf(salroom);
             
                                                                             if (index2 > -1) {
                         
                                                                                 Salas.splice(index, 1);

                                                                              } */
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
                                                            io.to(temp).emit('sinjugador')

                                                            return;
                                                           } 

                                                            console.log('entra al segundo intervalo')
                                                            const room2 = io.sockets.adapter.rooms[temp];
                                                            
                                                            
                                                          room2.time=4;
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

                                                                                if(room2.time==-4){
                                                                                    
                                                                                    room2.time = 4;
                                                                                }

                                                                              /* setTimeout(() => {
                                                                                  room2.time = 11;
                                                                              }, 6000); */
      
                                                                          
                                                                          } else {


                                                                            if(room2.time==4){
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


                                                    socket.on('sabertiempo',()=>{

                                                        const sala= socket.room;

                                                        if(io.nsps['/'].adapter.rooms[sala]==undefined){
                                                            return;
                                                           } 
                                                    const roomm = io.sockets.adapter.rooms[sala];
                                                
                                                    roomm.tiempo
                                                    socket.emit('tiempodevuelto',roomm.tiempo)

                                                    });










                                                    
                                                    socket.on('Ganador',async(data)=>{


                                                        /* console.log('valor de figura: '+data.valor)
                                                        console.log('arreglo: '+data.dato) */

                                                      let valorMarcado=0
                                                        valorMarcado= data.valor;
                                                        let estados=0;
                                                        let gana=false;
                                                        for (var i in data.dato){
                                                            
                                                            for(var j in data.dato[i]){
                                                             
                                                             
                                                              if(data.dato[i][j].estado){
                                                                estados=estados+1;
                                                             
                                                                }
                                                            }
                                                          
                
                                                          }
                
                                                          console.log('valor de estados: '+estados);

                                                          if(valorMarcado==1 && estados==4 || valorMarcado==2 && estados==4 ){
                                                            gana=true
                                                          }
                    
                                                          if(valorMarcado==3 && estados==5  || valorMarcado==4 && estados==5 ){
                                                            gana=true
                                                          }
                    
                                                          if(valorMarcado==5 && estados==6 || valorMarcado==6 && estados==6 || valorMarcado==7 && estados==6 ){
                                                            gana=true
                                                          }
                    
                                                          if(valorMarcado==8 && estados==9){
                                                            gana=true;
                                                          }


                                                            if(!gana){

                                                                return;
                                                            } 

                                                        const sala= socket.room;
                                                        if(io.nsps['/'].adapter.rooms[sala]==undefined){
                                                            return;
                                                           } 
                                                        const room = io.sockets.adapter.rooms[sala];
                                                      
                                                 

                                                          await    socket.to(sala).emit('loteria',{nombre:socket.username,foto:data.foto,ganador:false,color:room.color,cantidad_estrellas:0});//enviar el mensaje del ganador a todos menos al ganador XD
                                                          await   socket.emit('loteria',{nombre:socket.username,foto:data.foto,ganador:true,color:room.color,cantidad_estrellas:room.cantidad_maiz})

                                                           setTimeout(() => {

                                                            io.of('/').in(sala).clients((error, socketIds) => { if (error) throw error; socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(sala)); }); 

                                                           }, 1000);
 
    
                                                            })










                                                    function CartasRandom (data){

                                                        if(io.nsps['/'].adapter.rooms[data]==undefined){
                                                            return;
                                                           } 
                                                        const room = io.sockets.adapter.rooms[data];
                                                   
                                                        const valor= room.juego_tablero;
                                                        console.log('tamaño de arreglo: '+valor.length);
                                                        if(valor.length===0){

                                                            clearInterval(room.intervalo);

                                                            setTimeout(() => {

                                                                if(io.nsps['/'].adapter.rooms[data]==undefined){
                                                                    return;
                                                                   } 

                                                            io.to(data).emit('perdieron');
                                                            io.of('/').in(data).clients((error, socketIds) => { if (error) throw error; socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(data)); }); 

                                                            },6000);

                                                            
                                                            return;
                                                        }else{
                                                        

                                                        const eliminado=valor.shift();
                                                            console.log('eliminado en juego: '+eliminado);
                                                            room.ale=eliminado;
                                                       /*  io.to(data).emit('movecard',{target:eliminado,estado:true}); */

                                                        }
                                                           
    
    
    
                                                
                                                        }

                                                        function valor(data,target){
                                                            if(io.nsps['/'].adapter.rooms[data]==undefined){
                                                                return;
                                                               } 
                                                            io.to(data).emit('movecard',{target:target,estado:true});

                                                                                                                       
                                                        }









                                                    socket.on('Emoji',(emoji)=>{

                                                    const sala= socket.room;
                                                    if(io.nsps['/'].adapter.rooms[sala]==undefined){
                                                        return;
                                                       } 
                                                     socket.to(sala).emit('emoji', {nombre:socket.username,emojii:emoji});



                                                        })










                                                        socket.on('figura',()=>{

                                                            const sala= socket.room;
                                                            if(io.nsps['/'].adapter.rooms[sala]==undefined){
                                                                return;
                                                               } 
                                                            const roomm = io.sockets.adapter.rooms[sala];

                                                             socket.emit('cantidad_figura',{valor:roomm.figuras,color:roomm.color});
        
        
        
                                                                })







                                                        socket.on('Salir',data=>{

                                                            delete jugadores[socket.id]
                                                            const sala= socket.room;
                                                            if(io.nsps['/'].adapter.rooms[sala]==undefined){
                                                                return;
                                                               } 

                                                               let message=`${socket.username} abandonó la partida 🤨`
                                                               socket.to(sala).emit('abandonar_configuracion', message)
                                                               socket.to(sala).emit('abandonar_random', message)
                                                               socket.to(sala).emit('abandonar_espera', message)
                                                               socket.to(sala).emit('abandonar_juego', message)


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


                                                            const index2 = Salas.indexOf(sala);
             
                                                                 if (index2 > -1) {
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
                                                                 socket.to(sala).emit('cantidad_jugadores', cantjug) 

                                                                }else{
                                                                    return;
                                                                }
                                                             }
                                                         }
                                                       

                                                         if(Salasprivadas.length){

                                                   

                                                            if(io.nsps['/'].adapter.rooms[sala]==undefined){
         
                                                             const index = Salasprivadas.indexOf(sala);
         
                                                             if (index > -1) {
         
                                                                 Salasprivadas.splice(index, 1);
         
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



                                                             socket.to(sala).emit('cantidad_jugadores', cantjug) 

                                                             console.log('nuevo: '+ roomm.escoge_carton)

                                                         /*     let message=`${socket.username} abandonó la partida 🤨`
                                                             socket.to(sala).emit('abandonar', message) */
                                                             

         
                                                         }
                                                     }
                                                   
                                                          
                                                            
                                                            
            
            
                                                          
                                                             
                     
                     
                                                             })


                                            socket.on('disconnect',data=>{

                                               delete jugadores[socket.id]
                                               const sala= socket.room;
                                               if(io.nsps['/'].adapter.rooms[sala]==undefined){
                                                return;
                                               } 
                                               let message=`${socket.username} se desconectó por mala conexión 😢`

                                               socket.to(sala).emit('abandonar_configuracion', message)
                                               socket.to(sala).emit('abandonar_random', message)
                                               socket.to(sala).emit('abandonar_espera', message)
                                               socket.to(sala).emit('abandonar_juego', message)

/*                                                socket.emit('usuariodesconectado');
 */                                               console.log(socket.username + ' salió, error 404')
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


                                                    const index2 = Salas.indexOf(sala);
 
                                                    if (index2 > -1) {
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
                                                     socket.to(sala).emit('cantidad_jugadores', cantjug) 

                                                    }
                                                 }
                                             }
                                           

                                             if(Salasprivadas.length){

                                       

                                                if(io.nsps['/'].adapter.rooms[sala]==undefined){

                                                 const index = Salasprivadas.indexOf(sala);

                                                 if (index > -1) {

                                                     Salasprivadas.splice(index, 1);

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
                                                 socket.to(sala).emit('cantidad_jugadores', cantjug) 

                                                 console.log('nuevo: '+ roomm.escoge_carton)

                                            


                                             }
                                         }
                                       
                                              
        
                                               
                                                })



}
 
      
     
    

                      














  










