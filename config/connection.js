const mongoose = require('mongoose')

mongoose.set('strictQuery',true)

main().catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/CozaStore',{
        useNewUrlParser : true,
        useUnifiedTopology : true

    });
    console.log('connected to database....')
}

