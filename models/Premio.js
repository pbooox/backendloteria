const mongoose = require('mongoose');
const {Schema} =mongoose;
const premioSchema = new mongoose.Schema({

     foto:{

     },
     descripcion:{

     },
     fecha:{

     },
     departamento:{

     }
    ,user:[{

        type:Schema.Types.ObjectId,
        ref:'User',
        autopopulate: true

    }]
})

mongoose.model('Premio',premioSchema);