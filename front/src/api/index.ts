import instance from "./axios";
import { ref , shallowRef} from "vue";
import { store } from "./store"
import type { User, WorkingTime, AuthMode, Team } from "@/types/crudTypes";


const hasErrorOccured = ref<boolean>(false);
const errorMessage = ref<string | null>(null);
const emailError = ref<boolean>(false);
const passwordError = ref<boolean>(false);
const confirmPasswordError = ref<boolean>(false);
const passwordErrorMessge = ref<string | null>(null);
const confirmPasswordErrorMessge = ref<string | null>(null);
const usernameError = ref<boolean>(false);

const authenticate = async (path: string, userData: any, authMode:AuthMode) => {
  try {

    const response = authMode === 'register'
      ? await instance.post(path, {
        user: {
          email: userData.email,
          username: userData.username,
        }
      })
      : await instance.get(`${path}?email=${userData.email}&username=${userData.username}`);

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
// Get all users
async function getAllUsers(): Promise<User[]> {
  try {
    // get all users
    const response = await instance.get('/api/users');
    return response.data.data as User[];
  } catch (e) {
    console.log("Error fetching users:", e);
    return [];
  }
}

  // Create user
  async function createUser (user: User) {
    try {
      console.log(`Create user`);
      const resp = await instance.post(`/api/users`, {
        user: {
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role
        }
      });
      console.log(`Created user: ${resp.data.data}`);
      // Add your logic to handle the response here
    } catch (e) {
      console.log(`Error creating user: ${user.username}`, e);
    }
  };

// Get user by id
async function getUser(id: number): Promise<User | null> {
  try {
      // get user by id
      const response = await instance.get(`/api/users/${id}`);
      console.log('User data:', response.data);
      return response.data.data as User;
  } catch (e) {
      console.log("Error fetching user:", e);
      return null;
  }
}

// Modify user
async function modifyUser (user: User) {
  try {
      console.log(`Modify user with ID:`, user.id);
      // Change in the database
      const resp = await instance.put(`/api/users/${user.id}`, {
          user: {
              username: user?.username,
              email: user?.email, 
              role: user?.role
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

// Get teamMembers
async function getTeamMembers(team: Team) {
  try {
      // get all teams from user
      const res = await instance.get(`/api/team/user/${team.id}`);
      return res.data.data;
  } catch (e) {
      console.log("Error fetching teams:", e);
  }
}

// Modify team member role
async function modifyTeamMemberRole(user: User, team: Team, is_team_leader: boolean) {
  try {
      console.log(`Modify team member role`);
      // Modify team member role
      await instance.put(`/api/team/user/role/${user.id}/${team.id}`, {
        isTeamLeader: is_team_leader
    });
    
      console.log(`Modified team member role`);
  } catch (e) {
      console.log(`Error modifying team member role`, e);
  }
}

// get user team leader
async function isUserTeamLeader(user: User, team: Team) {
  try {
      // get all teams from user
      const res = await instance.get(`/api/team/user/isAdmin/${user.id}/${team.id}`);
      return res.data.data;
  } catch (e) {
      console.log("Error fetching teams:", e);
  }
}

// Get user teams
async function getUserTeams(user: User) {
  try {
      // get all teams from user
      const res = await instance.get(`/api/user/teams/${user.id}`);
      console.log('User teams:', res.data);
      return res.data.teams;
  } catch (e) {
      console.log("Error fetching user teams:", e);
  }
}

// Get user teams
async function getUserInTeam(team: Team) {
  try {
      // get all teams from user
      const res = await instance.get(`/api/team/users/${team.id}`);
      console.log('Team users:', res.data);
      return res.data.users;
  } catch (e) {
      console.log("Error fetching user teams:", e);
  }
}

// Delete user
async function deleteUser(userId: number) {
  try {
      console.log(`Delete user with ID:`, userId);
      // Delete user
      await instance.delete(`/api/users/${userId}`);
      console.log(`Deleted user with ID: ${userId}`);
  } catch (e) {
      console.log(`Error deleting user with ID: ${userId}`, e);
  }
}

//////////////////// TEAMS ///////////////////////

// Get all teams
async function getTeams() {
  try {
      // get all teams
      const res = await instance.get(`/api/teams`);
      return res.data.data;
  } catch (e) {
      console.log("Error fetching teams:", e);
  }
}

// Get team by id
async function getTeam(id: number): Promise<Team | null> {
  try {
      // get team by id
      const response = await instance.get(`/api/team/${id}`);
      return response.data.data as Team;
  } catch (e) {
      console.log("Error fetching team:", e);
      return null;
  }
}

// Create team
async function createTeam(name: string, managerId: number) {
  try {
      console.log(`Create team`);
      // Create team
      const teamCreated = await instance.post(`/api/team`, {
        team: {
          title: name,
      }
      });

      if (!teamCreated.data.data) {
        return null;
      }
      console.log(`Created team`, teamCreated.data.data);


      const teamMember = await instance.post(`/api/team/user/addUser/${managerId}/${teamCreated.data.data.id}`, {
       team_member : {
        userId: managerId,
        isTeamLeader: true}
      });

      if (!teamMember) {
        return null;
      }

      console.log(`Team leader added to team`, teamCreated.data.data);
      return teamCreated.data.data;
      
  } catch (e) {
      console.log(`Error creating team`, e);
      return null;
  }
}

// Modify team
async function modifyTeam(id: number, name: string, managerId: number) {
  try {
      console.log(`Modify team with ID:`, id);
      // Modify team
      await instance.put(`/api/team/${id}`, {
        team: {
          name: name,
          managerId: managerId
      }
      });
      console.log(`Modified team with ID: ${id}`);
  } catch (e) {
      console.log(`Error modifying team with ID: ${id}`, e);
  }
}

// Delete member from team
async function deleteMemberFromTeam(userId: number, teamId: number) {
  try {
      console.log(`Delete member from team with ID:`, userId);
      // Delete member from team
      await instance.delete(`/api/team/user/remove/${userId}/${teamId}`);
      console.log(`Deleted member with ID: ${userId} from team with ID: ${teamId}`);
  } catch (e) {
      console.log(`Error deleting member from team with ID: ${userId}`, e);
  }
}

// Delete team
async function deleteTeam(id: number) {
  try {
      console.log(`Delete team with ID:`, id);
      // Delete team
      await instance.delete(`/api/team/${id}`);
      console.log(`Deleted team with ID: ${id}`);
  } catch (e) {
      console.log(`Error deleting team with ID: ${id}`, e);
  }
}

// Add user to team
async function addUserToTeam(userId: number, teamId: number, isTeamLeader: boolean) {
  try {
    // Add user to team
    await instance.post(`/api/team/user/addUser/${userId}/${teamId}`, {
      team_member: {
        team_id : teamId,
        user_id: userId,
        is_team_leader: true
      }
    });
  } catch (e) {
  }
}

///////////////////// WORKING TIMES ///////////////////////

// Create working time
async function createWorkingTime(user: User, now: string) {
  try {
      console.log(`Create working time`);
      // Create working time
      await instance.post(`/api/workingtime/${user.id}`, {
        start: now,
        end: now
    });
      console.log(`Created working time`);
  } catch (e) {
      console.log(`Error creating working time`, e);
  }
}
// Get all working times from user
async function getWorkingTime(userId: number, workingTimeId : number): Promise<WorkingTime> {
  try {
      // get all working times from user

      const res = await instance.get(`/api/workingtime/${userId}/${workingTimeId}`);
      return res.data.data;
  } catch (e) {
      console.log("Error fetching working times:", e);
      throw e; // rethrow the error to handle it outside if needed
  }
}


// Get all working times from user
async function getWorkingTimes(user: User): Promise<WorkingTime[]> {
  try {
      // get all working times from user
      const res = await instance.get(`/api/workingtime/${user.id}`);
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
      await instance.put(`/api/workingtime/${lastWorkingTime.id}`, {
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
      await instance.delete(`/api/workingtime/${id}`);
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
      const res =  await instance.get(`/api/clocks/${user.id}`);
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
      await instance.post(`/api/clocks/${user.id}`, {
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
    confirmPasswordError,
    passwordErrorMessge,
    confirmPasswordErrorMessge,
    usernameError,
    turnOffError,
    authenticate,
    // Working time
    createWorkingTime,
    getWorkingTime,
    getWorkingTimes,
    modifyWorkingTime,
    deleteWorkingTime,
    // Users
    getAllUsers,
    getUser,
    modifyUser,
    createUser,
    deleteUser,
    // Clocks
    getClocks,
    createClock,
    // Teams
    createTeam,
    getTeams,
    getTeam,
    modifyTeam,
    deleteTeam,
    // UserTeams
    getUserTeams,
    getTeamMembers,
    modifyTeamMemberRole,
    isUserTeamLeader,
    deleteMemberFromTeam,
    addUserToTeam,
    getUserInTeam
  };
};
