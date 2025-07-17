import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const socket = io(SOCKET_SERVER_URL, {
    autoConnect: false,
});

export default socket;