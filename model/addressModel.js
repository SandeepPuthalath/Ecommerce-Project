
// user address details
const addressSchema = new mongoose.Schema({
    full_name : String,
    last_name : String,
    country : String,
    address_line_1 : String,
    address_line_2 : String,
    city : String,
    state : String,
    pin_code : Number,
    phone_number : Number
   
    
});

module.exports = mongoose.model('address', addressSchema);