const {model , Schema} = require("mongoose");


const postSchema = new Schema({
    body : String,
    username : String,
    createdAt : String,
    comments: [
        {
            body : String,
            username : String,
            createdAt : String,
        },
    ],
    likes : [
        {
            username : String,
            createdAt : String,
        }
    ],
    user : {
        type : Schema.Types.ObjectId,
        ref : 'users'
    }
})

module.exports = model('Post' , postSchema);


//frist we need to import the nessary things 

//create a schema for the particular Db

// export that schema with a name(  here "Post")

//here User obj is for linking this model to a specific user