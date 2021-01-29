const {model , Schema} = require("mongoose");



const userSchema = new Schema({
    username : String,
    password : String,
    email : String,
    createdAt : String
});

module.exports= model('User' , userSchema);



//frist we need to import the nessary things 

//create a schema for the particular Db

// export that schema with a name(  here "User")