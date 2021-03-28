const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const User = require("././../../models/User");
const { SECRECT_KEY } = require("./../../config");
const { validateRegisterInput, validateLoginInput } = require("./../../utils/validators");


function genarateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username
        },
        SECRECT_KEY,
        { expiresIn: "12h" }
    );
}

module.exports = {
    Mutation: {

        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);


            if (!valid) {
                throw new UserInputError("Errors", { errors });

            }


            const user = await User.findOne({ username });

            if (!user) {
                errors.genaral = "user not found";
                throw new UserInputError("User not found", { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.genaral = "Wrong credential";
                throw new UserInputError("Wrong credential", { errors });
            }

            const token = genarateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            }


        },

        async register(_, { registerInput: { username, email, password, confirmPassword } }, context, info) {
            //TODO: validate user data

            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }
            //TODO: make sure user doesn't already exist

            const user = await User.findOne({ username });

            if (user) {
                throw new UserInputError("Username is taken", {
                    errors: {
                        username: "This username is taken"
                    }
                });
            }


            //TODO: hash password and create auth token
            // const { registerInput: { username, email, password, confirmPassword } } = args;
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = genarateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }

}