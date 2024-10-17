import axios from "./axios";
import {jwtDecode} from "jwt-decode";

import type { User } from "../types/crudTypes";



function getUserFromToken() {
  const token = localStorage.getItem("token");
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
      const response = await axios.post("/api/auth/sign_in", { email, password });
      const token = response.data.token;
  
      // Save token to localStorage
      localStorage.setItem("token", token);
  
      // Set Authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
      // Redirect or handle sign-in success
    } catch (error) {
      // Handle error
    }
  }

// Sign out
function signOut() {
localStorage.removeItem("token");
delete axios.defaults.headers.common["Authorization"];
// Redirect or handle sign-out success
}


// Register

async function register(user : User) {
   
    try {
        const response = await axios.post("/api/auth/register", user);
        const token = response.data.token;

        // Save token to localStorage
        localStorage.setItem("token", token);
    } catch (error) {
        // Handle error
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