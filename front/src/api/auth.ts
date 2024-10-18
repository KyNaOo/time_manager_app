
import {jwtDecode} from "jwt-decode";
import type { User } from "../types/crudTypes";
import instance from "./axios";

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
      const response = await instance.post("/api/auth/signin", { email, password });
      const token = response.data.token;
      // Save token to localStorage
      localStorage.setItem("token", token);
      // Redirect or handle sign-in success
    } catch (error) {
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