import { set, connect } from 'mongoose';

set('strictQuery',true)
set('strictPopulate', false)

main().catch((err)=>{
    console.log(err);
})

async function main(){
    await connect('mongodb://127.0.0.1:27017/CozaStore',{
        useNewUrlParser : true,
        useUnifiedTopology : true

    });
    console.log('connected to database....')
}

