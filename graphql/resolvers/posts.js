const { AuthenticationError, UserInputError } = require("apollo-server");

const Post = require("./../../models/Post");
const checkAuth = require("./../../utils/check-auth");
module.exports = {
    Query: {
        async getPosts() {  //this is to get all the posts
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPost(_, { postId }) {  //this is for fetching one post by ID
            try {
                const post = await Post.findById(postId);

                if (post) {
                    return post;
                }
                else {
                    throw new Error("Post not found");
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context) {
            const user = checkAuth(context);
            // console.log(user)

            if(body.trim() === "") {
                throw new Error("Post body must not be empty")
            }
            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })
            const post = await newPost.save();

            context.pubsub.publish("NEW_POST", {
                newPost : post
            })

            return post;

        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);

            try {
                const post = await Post.findById(postId);
                if (user.username === post.username) {
                    await post.delete();
                    return "Post deleted Successfully";
                } else {
                    throw new AuthenticationError("Action isn't allowed");
                }
            } catch (err) {
                throw new Error(err);
            }


        },
        async likePost(_, { postId }, context) {
            const user = checkAuth(context);

            const post = await Post.findById(postId);
            if (post) {
                if (post.likes.find(like => like.username === user.username)) {
                    //post already liked , unlike it
                    post.likes = post.likes.filter(like => like.username != user.username);
                } else {
                    post.likes.push({
                        username: user.username,
                        createdAt: new Date().toISOString()
                    });
                }
                await post.save();
                return post;
            } else throw new UserInputError("Post not found");
        }
    },
    Subscription : {
        newPost : {
            subscribe : (_,__, { pubsub }) => pubsub.asyncIterator("NEW_POST")
        }
    }
}   