import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        isGroupChat: {type: Boolean, default: false},
        chatName: { type: String },
    },
    { timestamps: true}
);

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;