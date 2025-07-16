import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

//AXIOS is a library to make HTTP requests easily

//Login user
const loginUser = async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
};

const registerUser = async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
};

const fetchChats = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/chats`, { headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

const fetchMessages = async (chatId, token) => {
    const response = await axios.get(`${API_BASE_URL}/messages/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch messages');
    return await response.json();
}

const fetchCurrentUser = async (token) => {
    const res = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: {Authorization: `Bearer ${token}`}
    });
    return res.data;
};
export default { loginUser, registerUser, fetchChats, fetchMessages, fetchCurrentUser };

//All these help the frontend communicate with the backend by sending http requests to the backend. So when the user registers, the user's data is sent as a POST request to the backend which then processes the request and returns a response. Same thing for login and fetch chats