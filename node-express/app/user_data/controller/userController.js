import { User, Post } from '../model/user.js';

// Create a new user
export const createUser = async (req, res) => {
    const { username, email, name, age, gender, password } = req.body;
    try{
        const newUser = new User({ username, email, name, age, gender, password });
        await newUser.save();
        res.status(201).json(newUser);
    }catch(err){
        res.status(500).json({ message: err.message });
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