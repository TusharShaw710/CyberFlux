import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_URL}/api/auth`,
  withCredentials: true,
});

export async function register({username,email,password}) {
  try {
    const response = await api.post("/register", {  username, email, password });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function login({email, password}) {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function GetUser(){
    try {
        const response = await api.get("/get-user");
        return response.data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

export async function logoutUser() {
    try {
        const response = await api.post("/logout");
        return response.data;
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
}