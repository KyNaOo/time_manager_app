
import {jwtDecode} from "jwt-decode";
import type { User } from "../types/crudTypes";
import instance from "./axios";
import { store } from '@/api/store';
import router from "../router";

function getUserFromToken(token: string) {
  if (token) {
    const decoded = jwtDecode(token);
    return {
        decoded
    };
  }
  return null;
}

async function signIn(email: string, password: string) {
  try {
    console.log("Attempting to sign in with email:", email);
    const response = await instance.post("/api/auth/signin", { email, password });
    console.log("Received response:", response);
    const token = response.data.token;
    console.log("Extracted token:", token);
    localStorage.setItem("token", token);
    store.setToken(token);
    console.log("Token saved to localStorage and store");
    router.push('/');
    console.log("Redirecting to /app");
  } catch (error) {
    console.error("Error during sign-in:", error);
    throw error;
  }
}

// pour login
function signOut() {
localStorage.removeItem("token");
delete instance.defaults.headers.common["Authorization"];
}


// pour register

async function register(user : User) {
    try {
        const response = await instance.post("/api/auth/register", user);
        const token = response.data.token;
        localStorage.setItem("token", token);
        store.setToken(token);
        console.log("Token saved to localStorage and store");
    router.push('/');
    } catch (error) {
        throw error;
    }
}

  
export const useAuth = () => {
    return {
        signIn,
        signOut,
        register,
        getUserFromToken
    };
}