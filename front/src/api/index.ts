import axios from "./axios";
import { ref , shallowRef} from "vue";
import { store } from "./store";

import type { User, WorkingTime } from "@/types/crudTypes";
const hasErrorOccured = ref(false);
const errorMessage = ref(null);
const emailError = ref(false);
const passwordError = ref(false);
const passwordErrorMessge = ref(null);
const usernameError = ref(false);

const authenticate = async (path: string, userData: any) => {
  try {
    const response = await axios.get(path, userData);
    localStorage.setItem("token", response.data.email);
    store.updateHasLogin(true);
  } catch (err: any) {
    console.log("error: ", err.response.data);
    if (err.response.data.error == "Username field is required") {
      usernameError.value = true;
    } else if (err.response.data.error == "Email field is required") {
      emailError.value = true;
    } else if (err.response.data.error == "Password field is required") {
      passwordErrorMessge.value = null;
      passwordError.value = true;
    } else if (err.response.data.error == "Invalid password") {
      passwordError.value = true;
      passwordErrorMessge.value = err.response.data.error;
    } else {
      hasErrorOccured.value = true;
      errorMessage.value = err.response.data.error;
    }
  }
};

const turnOffError = () => {
  emailError.value = false;
  usernameError.value = false;
  passwordError.value = false;
  hasErrorOccured.value = false;
};

async function getWorkingTimes(user: User): Promise<WorkingTime[]> {
  try {
      // get all working times from user
      const res = await axios.get(`http://localhost:4000/api/workingtime/${user.id}`);
      return res.data.data;
  } catch (e) {
      console.log("Error fetching working times:", e);
      throw e; // rethrow the error to handle it outside if needed
  }
}

async function getUser(id: number) {
  try {
      // get user by id
      const response = await axios.get(`http://localhost:4000/api/users/${id}`)
        console.log('User data:', response.data)
        return response.data.data;
  } catch (e) {
      console.log("Error fetching user:", e);
  }

}


// Get all clocks from user
async function getClocks() {
  try {
      // get all clocks from user
      const res =  await axios.get(`http://localhost:4000/api/clocks/${props.user.id}`);
      return res.data.data;
  } catch (e) {
      console.log("Error fetching clocks:", e);
  }
}

async function modifyUser (user: User) {
  try {
      console.log(`Modify user with ID:`, user.id);
      const resp = await axios.put(`http://localhost:4000/api/users/${user.id}`, {
          user: {
              username: user?.username,
              email: user?.email
          }
      });
      console.log(`Modified user with ID: ${user.id}`);
      // Add your logic to handle the response here
  } catch (e) {
      console.log(`Error modifying user with ID: ${user.id}`, e);
  }
  };
  
  async function createUser (user: User) {
    try {
      console.log(`Create user`);
      const resp = await axios.post(`http://localhost:4000/api/users`, {
        user: {
          username: user.username,
          email: user.email
        }
      });
      console.log(`Created user: ${resp.data.data}`);
      // Add your logic to handle the response here
    } catch (e) {
      console.log(`Error creating user: ${user.username}`, e);
    }
  };


export const useApi = () => {
  return {
    hasErrorOccured,
    errorMessage,
    emailError,
    passwordError,
    passwordErrorMessge,
    usernameError,
    turnOffError,
    authenticate,
    // Working time
    getWorkingTimes,
    // Users
    getUser,
    modifyUser,
    createUser,
    // Clocks
    getClocks
  };
};
