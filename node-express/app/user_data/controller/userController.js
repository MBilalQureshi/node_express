import { User, Post } from '../model/user.js';
import validator from 'validator';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../../config/config.js';

// Function to generate access token
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, ACCESS_TOKEN_SECRET, {expiresIn: '10m'});
};

// Function to generate refresh token
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, REFRESH_TOKEN_SECRET, { expiresIn: '20m' });
};

// Trim spaces and remove extra spaces between words
const trimAndRemoveExtraSpaces = (str) => {
    return validator.trim(str).replace(/\s+/g, '');
};

// Function to validate required fields
const validateRequiredFields = (fields, res) => {
    for (const [key, value] of Object.entries(fields)) {
        if (!value && key !== 'age') {
            res.status(400).json({ message: `${key.charAt(0).toUpperCase() + key.slice(1)} is required` });
            return false;
        }
    }
    return true;
};

// Validate name to contain only alphabetic characters and spaces
const validateName = (name, res) => {
    const nameRegex = /^[a-zA-Z]+( [a-zA-Z]+)*$/;
    if (!nameRegex.test(name)) {
        res.status(400).json({ message: 'Name must contain only alphabetic characters and spaces' });
        return false;
    }
    if (name.length > 30) {
        res.status(400).json({ message: 'Name must be at most 30 characters long' });
        return false;
    }
    return true;
};

// Capitalize the first character of each part of the name
const capitalizeName = (str) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

// Validate email
const validateEmail = (email, res) => {
    if (!validator.isEmail(email)) {
        res.status(400).json({ message: 'Invalid email' });
        return false;
    }
    if (email.length > 30) {
        res.status(400).json({ message: 'Email must be at most 30 characters long' });
        return false;
    }
    return true;
};

// Validate age
const validateAge = (age, res) => {
    if (age.length > 0 && !validator.isInt(age, { min: 1, max: 100 })) {
        res.status(400).json({ message: 'Age must be a number between 1 and 100' });
        return false;
    }
    return true;
};

// Convert age to number
const convertAgeToNumber = (age) => {
    if (age.length > 0) {
        return parseInt(age, 10);
    }
    return age;
};

// Function to validate username
const validateUsername = (username, res) => {
    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    if (!usernameRegex.test(username)) {
        res.status(400).json({ message: 'Username can only contain alphanumeric characters, dots, and underscores' });
        return false;
    }
    if (username.length > 15) {
        res.status(400).json({ message: 'Username must be at most 15 characters long' });
        return false;
    }
    return true;
};

// Function to validate password
const validatePassword = (password, res) => {
    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        res.status(400).json({ message: 'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol' });
        return false;
    }
    return true;
};


// User Login
export const login = async (req, res)=> {
    const { username, password } = req.body;
    try{
        //validate username
        const user = await User.findOne({ username });
        console.log(user);
        if(!user) return res.status(404).json({ message: 'Invalid username or password111' });
        
        // validate password
        const validPassword = bcrypt.compare(password, user.password);
        if(!validPassword) return res.status(404).json({ message: 'Invalid username or password' });

        // Generate access and refresh token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(200).json({ "access token":accessToken, "refresh token":refreshToken });

    }catch(err){
        res.status(500).json({ message: 'Invalid username or password' });
    }
};
// Create a new user
export const createUser = async (req, res) => {
    let { username, email, name, age, gender, password } = req.body;

    // Destructuring assignment and mapping to trim and remove extra spaces
    [username, email, age, password] = [username, email, age.toString(), password].map(trimAndRemoveExtraSpaces); 

    // Check if required fields are present
    const requiredFields = { username, email, name, age, gender, password };
    if (!validateRequiredFields(requiredFields, res)) {
        return;
    }

    //Validate name
    if(!validateName(name, res)){
        return;
    }

    // Validate username
    if (!validateUsername(username, res)) {
        return;
    }
    name = capitalizeName(name);

    // Validate email
    if (!validateEmail(email, res)) {
        return;
    }

    // Validate age
    if (!validateAge(age, res)) {
        return;
    }

    // Convert age to number if it is not empty
    age = convertAgeToNumber(age);

    // Validate password
    if (!validatePassword(password, res)) {
        return;
    }

    try{
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ username, email, name, age, gender, password: hashedPassword });
        await newUser.save();
        res.status(201).json(newUser);
    }catch(err){
        res.status(500).json({
            message: `An error occurred while creating the user. Please try again later.${err.message}`,
            status: false,
        });
    }
}

//Get user by id
export const getUser = async (req, res) => {
    const { id } = req.params;
    try{
        const objectId = mongoose.Types.ObjectId.createFromHexString(id);
        const user = await User.findOne({ id:objectId });
        if(user){
            res.status(200).json(user);
        }else{
            res.status(404).json({ message: 'User not found' });
        }
    }catch(err){
        res.status(500).json({ message: `An error occurred while creating the user. Please try again later.` });
    }
}

//Get all users
export const getAllUsers = async (_, res) => {
    try{
        const users = await User.find();
        if(users){
            res.status(200).json(users);
        }else{
            res.status(404).json({ message: 'No users found' });
        }
    }catch(err){
        res.status(500).json({ message: `An error occurred while creating the user. Please try again later.`});
    }
}

//Update user by id
export const updateUser = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    let { username, email, name, age, gender, password } = req.body;

    // Trim spaces and remove all spaces
    [username,email, name, age, gender, password] = [username, email, name, age.toString(), gender, password].map(trimAndRemoveExtraSpaces);

    // Check if required fields are present
    const requiredFields = { username, email, name, age, gender, password };
    if (!validateRequiredFields(requiredFields, res)) {
        return;
    }

    // Validate email
    if (!validateEmail(email, res)) {
        return;
    }

    // Validate age
    if (!validateAge(age, res)) {
        return;
    }

    // Convert age to number if it is not empty
    age = convertAgeToNumber(age);

    // Validate name
    if (!validateName(name, res)) {
        return;
    }

    // Capitalize the first character of each part of the name
    name = capitalizeName(name);

    // Validate username
    if (!validateUsername(username, res)) {
        return;
    }

    // Validate password
    if (!validatePassword(password, res)) {
        return;
    }

    try {
        // Ensure id is a valid ObjectId string
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //Id is an ObjectId
        const objectId = mongoose.Types.ObjectId.createFromHexString(id);
        const updateUser = await User.findOneAndUpdate({ _id: objectId }, { username, email, name, age, gender, password: hashedPassword }, { new: true });
        if (updateUser) {
            res.status(200).json(updateUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: `An error occurred while creating the user. Please try again later.` });
    }
};

//Delete user by id
export const deleteUser = async (req, res) => {
    const {id} = req.params;
    try{
        const objectId = mongoose.Types.ObjectId.createFromHexString(id);
        const updateUser = await User.findOneAndDelete({ _id: objectId});
        if(updateUser){
            res.status(200).json({ message: 'User deleted successfully'});
        }else{
            res.status(404).json({ message: 'User not found' });
        }
    }catch(err){
        res.status(500).json({ message: `An error occurred while creating the user. Please try again later.` });
    }
}

// Create a new post
export const createPost = async (req, res) => {
    const { title, content, author } = req.body;
    try{
        //Fetch user by id
        console.log(title);
        console.log(content);
        console.log(author);
        const user = await User.findById(author);
        console.log(user);
        if(!user) return res.status(404).json({ message: 'User not found' });

        const newPost = new Post({ title, content, author: author });
        await newPost.save();
        res.status(201).json(newPost);

    }catch(err){
        res.status(500).json({message: `An error occurred while creating the user. Please try again later.`});
    }
}

// Get all posts
export const getAllPosts = async (_, res) => {
    try{
        // Retrieves all posts and populates the author field with the corresponding User documents.
        const posts = await Post.find().populate('author');
        // console.log(posts);
        if(posts.length > 0){
            console.log('I am here',posts);
            res.status(200).json(posts);
        }else{
            res.status(404).json({ message: 'No posts found' });
        }
    }catch(err){
        res.status(500).json({ message: `An error occurred while creating the user. Please try again later.` });
    }
}