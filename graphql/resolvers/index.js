const postsResovers  = require("./posts");
const usersResolvers = require("./users");


module.exports = {
    Query : {
        ...postsResovers.Query
    },
    Mutation : {
        ...usersResolvers.Mutation
    }
}