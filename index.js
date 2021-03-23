const { ApolloServer , PubSub } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config");



// const typeDefs = gql`
//     type Query{
//         sayhi : String!
//     }
// `


// const resolvers = {
//     Query : {
//         sayhi : () => "Hello World !"
//     }
// }

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context : ({ req }) => ({req , pubsub})
});

mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => {
        console.log("atlas DB server started")
        return server.listen({ port: 8000 })
    }).then(res => {
        console.log(`server running at ${res.url}`)
    }).catch((err) => {
        console.log(err, "*********")
    });

    // server.listen({port : 8000}).then(res => {
    //     console.log(`server running at ${res.url}`)
    // }).catch((err) => {
    //     console.log(err , "*********")
    // })