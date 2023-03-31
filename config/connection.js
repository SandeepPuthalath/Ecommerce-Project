import { set, connect } from 'mongoose';
import { config } from "dotenv";
config();
const uri = process.env.MONGODB_URI

set('strictQuery',true)
set('strictPopulate', false)

main().catch((err)=>{
    console.log(err);
})

async function main(){
    await connect(uri,{
        useNewUrlParser : true,
        useUnifiedTopology : true

    });
    console.log('connected to database....')
}

