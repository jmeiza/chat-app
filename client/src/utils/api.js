import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

//AXIOS is a library to make HTTP requests easily

//Login user
const loginUser = async (credentials) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, credentials);
    return response.data;
};

const registerUser = async (userData) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, userData);
    return response.data;
};

const fetchChats = async (token) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/chats`, { headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

const fetchMessages = async (chatId, token) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages/${chatId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data
    }
    catch(error) {
        console.error('fetchMessages error:', error?.respnse?.data || error.message);
        throw new Error('Failed to fetch messages');
    }
}

const fetchCurrentUser = async (token) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
        headers: {Authorization: `Bearer ${token}`}
    });
    return res.data;
};
export default { loginUser, registerUser, fetchChats, fetchMessages, fetchCurrentUser };

//All these help the frontend communicate with the backend by sending http requests to the backend. So when the user registers, the user's data is sent as a POST request to the backend which then processes the request and returns a response. Same thing for login and fetch chats