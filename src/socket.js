// src/socket.js
import { io } from "socket.io-client";
import { apiUrl } from "./Api";

const socket = io(`${apiUrl}`); // Connect to the Socket.IO server

export default socket;
