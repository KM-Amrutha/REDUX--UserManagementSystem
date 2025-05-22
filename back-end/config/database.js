const mongoose = require('mongoose')

const connectDB = async() =>{
    try{

        await mongoose.connect(process.env.MongoDB_URI)
        console.log('mongo db connected')

    }
    catch(error){
        console.error('connection error', error)
    }
}