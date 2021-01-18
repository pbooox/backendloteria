const mongoose = require('mongoose');
const {Schema} =mongoose;
const maiz2Schema = new mongoose.Schema({
    amarillo:{
        type:Number,
    
       
    },
    morado:{
        type:Number,
   
       
    },
    blanco:{
        type:Number,
    
       
    },
    rojo:{
        type:Number,
     
       
    },
    user:[{

        type:Schema.Types.ObjectId,
        ref:'User',
        autopopulate: true

    }]
})

mongoose.model('Maiz2',maiz2Schema);