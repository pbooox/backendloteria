const mongoose = require('mongoose');
const {Schema} =mongoose;
const maiz2Schema = new mongoose.Schema({
    amarillo:{
        type:Number,
        required:true
       
    },
    morado:{
        type:Number,
        required:true
       
    },
    blanco:{
        type:Number,
        required:true
       
    },
    rojo:{
        type:Number,
        required:true
       
    },
    user:[{

        type:Schema.Types.ObjectId,
        ref:'User',
        autopopulate: true

    }]
})

mongoose.model('Maiz2',maiz2Schema);