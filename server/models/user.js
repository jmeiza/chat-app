import mongoose from "mongoose";

//Schema: like a bleueprint for how data should be stored in the mongoose database

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true, //removes extra space
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {timestamps: true}
);

const User = mongoose.model('User', userSchema);

export default User;