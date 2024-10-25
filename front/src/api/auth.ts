
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
    console.log("PASSSSSSSSSSSSSSSSSSSSSS0");
    const response = await instance.post("/api/auth/signin", { email, password });
    console.log("Received response:", response);
    const token = response.data.token;
    console.log("Extracted token:", token);
    // Save token to localStorage
    localStorage.setItem("token", token);
    store.setToken(token);
    console.log("Token saved to localStorage and store");
    router.push('/');
    console.log("Redirecting to /app");
    // Redirect or handle sign-in success
  } catch (error) {
    console.error("Error during sign-in:", error);
    console.error("Error during sign-in:", JSON.stringify(error, null, 2));
    console.log("PASSSSSSSSSSSSSSSSSSSSSS1");
    throw error;
    // Handle error
  }
}

// Sign out
function signOut() {
localStorage.removeItem("token");
delete instance.defaults.headers.common["Authorization"];
// Redirect or handle sign-out success
}


// Register

async function register(user : User) {
    try {
        const response = await instance.post("/api/auth/register", user);
        const token = response.data.token;
        // Save token to localStorage
        localStorage.setItem("token", token);
        store.setToken(token);
        console.log("Token saved to localStorage and store");
    router.push('/');
    } catch (error) {
        // Handle error
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