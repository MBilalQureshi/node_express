import { User, Post } from '../model/user.js';
import validator from 'validator';

// Create a new user
export const createUser = async (req, res) => {
    let { username, email, name, age, gender, password } = req.body;

    // Trim spaces and remove extra spaces between words
    const trimAndRemoveExtraSpaces = (str) => {
        return validator.trim(str).replace(/\s+/g, '');
    };
    // Destructuring assignment and mapping to trim and remove extra spaces
    [username, email, age, password] = [username, email, age.toString(), password].map(trimAndRemoveExtraSpaces); 

    // Check if required fields are present
    const requiredFields = { username, email, name, age, gender, password };
    for (const [key, value] of Object.entries(requiredFields)) {
        if (!value && key !== 'age') {
            return res.status(400).json({ message: `${key.charAt(0).toUpperCase() + key.slice(1)} is required` });
        }
    }

    // Validate name to contain only alphabetic characters and spaces
    const nameRegex = /^[a-zA-Z]+( [a-zA-Z]+)*$/;
    if (!nameRegex.test(name)) {
        return res.status(400).json({ message: 'Name must contain only alphabetic characters and spaces' });
    }
    // Capitalize the first character of each part of the name
    const capitalizeName = (str) => {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };
    name = capitalizeName(name);

    // validate email
    if(!validator.isEmail(email)){
        return res.status(400).json({ message: 'Invalid email' });
    }

    // Validate age
    if (age.length > 0 && !validator.isInt(age, { min: 1, max: 100 })) {
        return res.status(400).json({ message: 'Age must be a number between 1 and 100' });
    }

    // Convert age back to number if it is not empty
    if(age.length > 0){
        age = parseInt(age, 10);
    }

    try{
        const newUser = new User({ username, email, name, age, gender, password });
        await newUser.save();
        res.status(201).json(newUser);
    }catch(err){
        res.status(500).json({ 
            message: `An error occurred while creating the user. Please try again later.${err.message}`,
            status: false,
        });
    }
}

//Get user by user name
export const getUser = async (req, res) => {
    const {username} = req.params;
    try{
        const user = await User.findOne({ username });
        if(user){
            res.status(200).json(user);
        }else{
            res.status(404).json({ message: 'User not found' });
        }
    }catch(err){
        res.status(500).json({ message: err.message });
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
        res.status(500).json({ message: err.message});
    }
}

//Update user by username
export const updateUser = async (req, res) => {
    const {username} = req.params;
    const {password} = req.body;
    try{
        const updateUser = await User.findOneAndUpdate({ username }, { password }, { new: true });
        if(updateUser){
            res.status(200).json(updateUser);
        }else{
            res.status(404).json({ message: 'User not found' });
        }
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}

//Delete user by username
export const deleteUser = async (req, res) => {
    const {username} = req.params;
    try{
        const updateUser = await User.findOneAndDelete({ username });
        if(updateUser){
            res.status(200).json({ message: 'User deleted successfully'});
        }else{
            res.status(404).json({ message: 'User not found' });
        }
    }catch(err){
        res.status(500).json({ message: err.message });
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
        res.status(500).json({message: err.message});
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
        res.status(500).json({ message: err.message });
    }
}