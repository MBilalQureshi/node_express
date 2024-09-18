import mongoose from "mongoose";
import validator from "validator";

// Define the User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        maxLength: [15, 'Username cannot be more than 15 characters'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate:{
            validator: validator.isEmail,
            message: 'Invalid email'
        },
        trim: true,
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxlength: [30, 'Name must be at most 30 characters long'],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z]+( [a-zA-Z]+)*$/.test(v);
            },
            message: 'Name must contain only alphabetic characters and spaces'
        },
        trim: true,
    },
    age: {
        type: Number,
        required: false,
        min: [1, 'Age must be at least 1'],
        max: [100, 'Age must be at most 100'],
        // validate: {
        //     validator: Number.isInteger,
        //     message: 'Age must be a Number'
        // },
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['male', 'female', 'Others']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        validate: {
            validator: function (v) {
                return validator.isStrongPassword(v, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                });
            },
            message: 'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol'
        }
    },
});

// Define the Post schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create models for User and Post
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

// Export the models as named exports
export { User, Post };