const postsResovers  = require("./posts");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");


module.exports = {
    Post : {
        likeCount = (parent)  => parent.likes.length,
        commentCount = (parent) =>  parent.comments.length
    },
    Query : {
        ...postsResovers.Query
    },
    Mutation : {
        ...usersResolvers.Mutation,
        ...postsResovers.Mutation,
        ...commentsResolvers.Mutation
    },
    Subscription:{
        ...postsResovers.Subscription
    }
}