import axios from "axios";

const api = axios.create({
  baseURL: "https://cyberflux-yyap.onrender.com/api/auth",
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