const mongoose = require('mongoose');
const {Schema} =mongoose;
const premioSchema = new mongoose.Schema({

     foto:{
        type:String,
        required:true
     },
     descripcion:{
        type:String,
        required:true
     },
     fecha:{
        type:String,
        required:true
     },
     departamento:{
        type:String,
        required:true
     },
     color:{
        type:String,
        required:true
     }
    ,user:[{

        type:Schema.Types.ObjectId,
        ref:'User',
        autopopulate: true

    }]
})

mongoose.model('Premio',premioSchema);