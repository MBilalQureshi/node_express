import User from '../model/user.js';

// Create a new user
export const createUser = async (req, res) => {
    const { username, password } = req.body;
    try{
        const newUser = new User({ username, password });
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