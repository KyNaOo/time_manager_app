import axios from "./axios";
import { ref , shallowRef} from "vue";
import { store } from "./store"
import type { User, WorkingTime, AuthMode } from "@/types/crudTypes";


const hasErrorOccured = ref<boolean>(false);
const errorMessage = ref<string | null>(null);
const emailError = ref<boolean>(false);
const passwordError = ref<boolean>(false);
const passwordErrorMessge = ref<string | null>(null);
const usernameError = ref<boolean>(false);

const authenticate = async (path: string, userData: any, authMode:AuthMode) => {
  try {

    const response = authMode === 'register'
      ? await axios.post(path, {
        user: {
          email: userData.email,
          username: userData.username,
        }
      })
      : await axios.get(`${path}?email=${userData.email}&username=${userData.username}`);

      console.log(`${authMode === 'register' ? 'Register' : 'Login'} response: `, response.data.data);

    if (response.data.data == null) {
      hasErrorOccured.value = true;
      errorMessage.value = "User not found";
    } else {
      localStorage.setItem("user", JSON.stringify(response.data.data as User));
    }
    
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


///////////////////// USERS ///////////////////////

  // Create user
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

// Get user by id
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

// Modify user
async function modifyUser (user: User) {
  try {
      console.log(`Modify user with ID:`, user.id);
      // Change in the database
      const resp = await axios.put(`http://localhost:4000/api/users/${user.id}`, {
          user: {
              username: user?.username,
              email: user?.email
          }
      });
      if (resp.data.data) {
          // Change in local storage
          localStorage.setItem("user", JSON.stringify(resp.data.data));
          // Show success message in frontend
          alert("User modified successfully");
          
      }
      console.log(`Modified user with ID: ${user.id}`);
      // Add your logic to handle the response here
  } catch (e) {
      console.log(`Error modifying user with ID: ${user.id}`, e);
  }
  };

// Delete user
async function deleteUser(user: User) {
  try {
      console.log(`Delete user with ID:`, user.id);
      // Delete user
      await axios.delete(`http://localhost:4000/api/users/${user.id}`);
      console.log(`Deleted user with ID: ${user.id}`);
  } catch (e) {
      console.log(`Error deleting user with ID: ${user.id}`, e);
  }
}

///////////////////// WORKING TIMES ///////////////////////

// Create working time
async function createWorkingTime(user: User, now: string) {
  try {
      console.log(`Create working time`);
      // Create working time
      await axios.post(`http://localhost:4000/api/workingtime/${user.id}`, {
        start: now,
        end: now
    });
      console.log(`Created working time`);
  } catch (e) {
      console.log(`Error creating working time`, e);
  }
}



// Get all working times from user
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

// Modifuy modifyWorkingTime  
async function modifyWorkingTime(now: string, lastWorkingTime: WorkingTime) {
  try {
      console.log(`Modify Woking time`);
      // Modify clock
      await axios.put(`http://localhost:4000/api/workingtime/${lastWorkingTime.id}`, {
        workingtime: { end: now }
    });
      console.log(`Modified Woking time`);
  } catch (e) {
      console.log(`Error modifying Woking time`, e);
  }
}

// Delete working time
async function deleteWorkingTime(id: number): Promise<boolean> {
  try {
      console.log(`Delete working time with ID:`, id);
      // Delete working time
      await axios.delete(`http://localhost:4000/api/workingtime/${id}`);
      console.log(`Deleted working time with ID: ${id}`);
      return true;
  } catch (e) {
      console.log(`Error deleting working time with ID: ${id}`, e);
      return false;
  }
}

///////////////// CLOCKS////////////////////
// Get all clocks from user
async function getClocks(user: User) {
  try {
      // get all clocks from user
      const res =  await axios.get(`http://localhost:4000/api/clocks/${user.id}`);
      return res.data.data;
  } catch (e) {
      console.log("Error fetching clocks:", e);
  }
}

// Create clock
async function createClock(user: User, now: string, status: boolean) {
  try {
      console.log(`Create clock`);
      // Create clock
      await axios.post(`http://localhost:4000/api/clocks/${user.id}`, {
            time: now,
            status: status,
        });
      console.log(`Created clock`);
  } catch (e) {
      console.log(`Error creating clock`, e);
  }
}






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
    createWorkingTime,
    getWorkingTimes,
    modifyWorkingTime,
    deleteWorkingTime,
    // Users
    getUser,
    modifyUser,
    createUser,
    deleteUser,
    // Clocks
    getClocks,
    createClock,
    
  };
};
