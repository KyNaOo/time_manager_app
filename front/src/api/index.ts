import instance from "./axios";
import { ref , shallowRef} from "vue";
import { store } from "./store"
import type { User, WorkingTime, AuthMode, Team,TeamMember} from "@/types/crudTypes";

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
// recup all users
async function getAllUsers(): Promise<User[]> {
  try {
    const response = await instance.get('/api/users');
    return response.data.data as User[];
  } catch (e) {
    console.log("Error fetching users:", e);
    return [];
  }
}

  // créer un user
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
    } catch (e) {
      console.log(`Error creating user: ${user.username}`, e);
    }
  };

// recup user par id
async function getUser(id: number): Promise<User | null> {
  try {
      const response = await instance.get(`/api/users/${id}`);
      console.log('User data:', response.data);
      return response.data.data as User;
  } catch (e) {
      console.log("Error fetching user:", e);
      return null;
  }
}

// modifier user
async function modifyUser (user: User): Promise<User | null> {
  try {
      console.log(`Modify user with ID:`, user.id);
      const resp = await instance.put(`/api/users/${user.id}`, {
          user: {
              username: user?.username,
              email: user?.email, 
              role: user?.role
          }
      });
      if (resp.data.data) {
          localStorage.setItem("user", JSON.stringify(resp.data.data));          
      }
      console.log(`Modified user with ID: ${user.id}`);

      return resp.data.data;
  } catch (e) {
      console.log(`Error modifying user with ID: ${user.id}`, e);
      return null;
  }
  };

// recup membre team
async function getTeamMembers(team: Team): Promise<TeamMember[] | null> {
  try {
    console.log(`Get team members for team with ID:`, team.id);
      const res = await instance.get(`/api/team/users/${team.id}`);
      return res.data.users;
  } catch (e) {
      console.log("Error fetching team members:", e);
      return null;
  }
}

// modidifer role d'un team member
async function modifyTeamMemberRole(user: User, team: Team, is_team_leader: boolean) {
  try {
      console.log(`Modify team member role`);
      await instance.put(`/api/team/user/role/${user.id}/${team.id}`, {
        isTeamLeader: is_team_leader
    });
    
      console.log(`Modified team member role`);
  } catch (e) {
      console.log(`Error modifying team member role`, e);
  }
}

// recup leader d'une team
async function isUserTeamLeader(user: User, team: Team) {
  try {
      const res = await instance.get(`/api/team/user/isAdmin/${user.id}/${team.id}`);
      return res.data.data;
  } catch (e) {
      console.log("Error fetching teams:", e);
  }
}

// recup membre team
async function getUserTeams(user: User) {
  try {
      const res = await instance.get(`/api/user/teams/${user.id}`);
      console.log('User teams:', res.data);
      return res.data.teams;
  } catch (e) {
      console.log("Error fetching user teams:", e);
  }
}


// suppr un user
async function deleteUser(userId: number) {
  try {
      console.log(`Delete user with ID:`, userId);
      await instance.delete(`/api/users/${userId}`);
      console.log(`Deleted user with ID: ${userId}`);
  } catch (e) {
      console.log(`Error deleting user with ID: ${userId}`, e);
  }
}

//////////////////// TEAMS ///////////////////////

// recup toute les teams
async function getTeams() {
  try {
      const res = await instance.get(`/api/teams`);
      return res.data.data;
  } catch (e) {
      console.log("Error fetching teams:", e);
  }
}

// recup team par id
async function getTeam(id: number): Promise<Team | null> {
  try {
      const response = await instance.get(`/api/team/${id}`);
      return response.data.data as Team;
  } catch (e) {
      console.log("Error fetching team:", e);
      return null;
  }
}

// créer une team
async function createTeam(name: string, managerId: number) {
  try {
      console.log(`Create team`);
      const teamCreated = await instance.post(`/api/team`, {
        team: {
          title: name,
      }
      });

      if (!teamCreated.data.data) {
        return null;
      }
      console.log(`Created team`, teamCreated.data.data);

      return teamCreated.data.data;
      
  } catch (e) {
      console.log(`Error creating team`, e);
      return null;
  }
}

// modif une team
async function modifyTeam(id: number, name: string, managerId: number) {
  try {
      console.log(`Modify team with ID:`, id);
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

// suppr un membre d'une team
async function deleteMemberFromTeam(userId: number, teamId: number) {
  try {
      console.log(`Delete member from team with ID:`, userId);
      await instance.delete(`/api/team/user/remove/${userId}/${teamId}`);
      console.log(`Deleted member with ID: ${userId} from team with ID: ${teamId}`);
  } catch (e) {
      console.log(`Error deleting member from team with ID: ${userId}`, e);
  }

} 

// ajouter un user a une team
async function addUserToTeam(userId: number, teamId: number) {
  try {
    console.log(`Add user to team with ID:`, userId);
    await instance.post(`/api/team/user/addUser/${userId}/${teamId}`);
    console.log(`Added user with ID: ${userId} to team with ID: ${teamId}`);
  } catch (e) {
    console.log(`Error adding user with ID: ${userId} to team with ID: ${teamId}`, e);
  }
}

// supprr une team
async function deleteTeam(id: number) {
  try {
      console.log(`Delete team with ID:`, id);
      await instance.delete(`/api/team/${id}`);
      console.log(`Deleted team with ID: ${id}`);
  } catch (e) {
      console.log(`Error deleting team with ID: ${id}`, e);
  }
}

// ajouter un membre a une team
async function addTeamMember(userId: number, teamId: number, isTeamLeader: boolean) {
  try {

    console.log(`Add user ${userId} to team ${teamId} as team leader: ${isTeamLeader}`);

    const team_member = await instance.post(`/api/team/user/addUser/${userId}/${teamId}`, {
      team_member: {
        team_id : teamId,
        user_id: userId,
        is_team_leader: isTeamLeader
      }
    });
    console.log(`TEAM MEMBER:`, team_member);

    console.log(`Added user ${userId} to team ${teamId} `);

    return team_member.data;
  } catch (e) {
    throw e;
  }
}


// Delete Team member
async function deleteTeamMember(userId: number, teamId: number) {
  try {
    console.log(`Delete member from team with ID:`, userId);
    // Delete member from team
    await instance.delete(`/api/team/user/remove/${userId}/${teamId}`);
    console.log(`Deleted member with ID: ${userId} from team with ID: ${teamId}`);
  } catch (e) {
      console.log(`Error deleting member from team with ID: ${userId}`, e);
  }
}




///////////////////// WORKING TIMES ///////////////////////

// créer un working time
async function createWorkingTime(user: User, now: string) {
  try {
      console.log(`Create working time`);
      await instance.post(`/api/workingtime/${user.id}`, {
        start: now,
        end: now
    });
      console.log(`Created working time`);
  } catch (e) {
      console.log(`Error creating working time`, e);
  }
}
async function getWorkingTime(userId: number, workingTimeId : number): Promise<WorkingTime> {
  try {

      const res = await instance.get(`/api/workingtime/${userId}/${workingTimeId}`);
      return res.data.data;
  } catch (e) {
      console.log("Error fetching working times:", e);
      throw e; 
  }
}


// recup all working times
async function getWorkingTimes(user: User): Promise<WorkingTime[]> {
  try {
      const res = await instance.get(`/api/workingtime/${user.id}`);
      return res.data.data;
  } catch (e) {
      console.log("Error fetching working times:", e);
      throw e;
  }
}

// modifier working time 
async function getTeamWorkingTimes(teamId: number, teamMembers : TeamMember[]): Promise<WorkingTime[]> {
  try {
      console.log(`Get team working times for team with ID:`, teamId);
      console.log(`Team members:`, teamMembers);
      const userIds = teamMembers.map((teamMember) => teamMember.user_id);
      const users: User[] = (await Promise.all(userIds.map((userId) => getUser(Number(userId))))).filter((user): user is User => user !== null);
      const workingTimes: WorkingTime[] = [];      
      for (const user of users) {
        const userWorkingTimes = await getWorkingTimes(user as User);
        workingTimes.push(...userWorkingTimes);
      }
      return workingTimes;
  } catch (e) {
      console.log("Error fetching working times:", e);
      throw e;
  }
}

// modifier working time  
async function modifyWorkingTime(now: string, lastWorkingTime: WorkingTime) {
  try {
      console.log(`Modify Woking time`);
      await instance.put(`/api/workingtime/${lastWorkingTime.id}`, {
        workingtime: { end: now }
    });
      console.log(`Modified Woking time`);
  } catch (e) {
      console.log(`Error modifying Woking time`, e);
  }
}

// suppr un working time
async function deleteWorkingTime(id: number): Promise<boolean> {
  try {
      console.log(`Delete working time with ID:`, id);
      await instance.delete(`/api/workingtime/${id}`);
      console.log(`Deleted working time with ID: ${id}`);
      return true;
  } catch (e) {
      console.log(`Error deleting working time with ID: ${id}`, e);
      return false;
  }
}

///////////////// CLOCKS////////////////////
// recup all clocks d'un user
async function getClocks(user: User) {
  try {
      const res =  await instance.get(`/api/clocks/${user.id}`);
      return res.data.data;
  } catch (e) {
      console.log("Error fetching clocks:", e);
  }
}

// créer un clock
async function createClock(user: User, now: string, status: boolean) {
  try {
      console.log(`Create clock`);
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
    addUserToTeam,
    getTeamWorkingTimes,
    // User Teams
    getUserTeams,

    // TeamMembers
    addTeamMember,
    deleteTeamMember,
    getTeamMembers,
    modifyTeamMemberRole,
    isUserTeamLeader,
  };
};
