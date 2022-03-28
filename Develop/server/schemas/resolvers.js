const { AuthenticationError } = require('apollo-server-express');
const { saveBook } = require('../controllers/user-controller');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        async getSingleUser(_, { user = null, params }, { req }) {
            const foundUser = await User.findOne({
                $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
            });
            if (!foundUser) {
                throw new AuthenticationError('Cannot find a user with this id!');
            }
            return foundUser;
        }
    },
    Mutation: {
        async createUser(_, { body }, { req }) {
            const user = await User.create(body);
            if (!user) {
                throw new AuthenticationError('Something is wrong!');
            }
            const token = signToken(user);
            return { token, user };
        },  
        async login(_, { body }, { req }) {
            const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
            if (!user) {
                throw new AuthenticationError("Can't find this user");
            }
            const correctPw = await user.isCorrectPassword(body.password);
            if (!correctPw) {
                throw new AuthenticationError('Wrong password!');
            }
            const token = signToken(user);
            return { token, user };
        },
        async saveBook(_, { body }, { req }) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.user._id },
                { $addToSet: { savedBooks: body } },
                { new: true, runValidators: true }
            );
            return updatedUser;
        },  
        async deleteBook(_, { body }, { req }) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.user._id },
                { $pull: { savedBooks: { _id: body._id } } },
                { new: true, runValidators: true }
            );
            return updatedUser;
        }   
    }   
}
