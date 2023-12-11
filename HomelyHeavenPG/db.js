const mongoose=require('mongoose');

var mongoURL='mongodb://localhost:27017/mern-rooms'

mongoose.connect(mongoURL,{useUnifiedTopology : true , useNewURLParser : true})

var connection = mongoose.connection

connection.on('error',()=>{
    console.log('Mongo DB Connection Failed')
})

connection.on('connected',()=>{
    console.log('Mongo DB Connection Successful')
})

module.exports=mongoose;