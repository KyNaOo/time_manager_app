import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserView from '../views/UserView.vue'
import UsersView from '../views/UsersView.vue'
import WorkingTime from '@/views/WorkingTimeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProfileView from '@/views/ProfileView.vue'

import axios from '@/api/axios'
import { store } from '@/api/store';
import TeamsView from '@/views/TeamsView.vue'
import TeamView from '@/views/TeamView.vue'
import CreationView from '@/views/CreationView.vue'
import UserAddTeamView from '@/views/UserAddTeamView.vue'

const router = createRouter({
  // history: createMemoryHistory(),
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/app',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/app/profile',
      name: 'appProfile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    { 
      path: '/app/teams',
      name: 'teams',
      component: TeamsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/app/team/:id',
      name: 'team',
      component: TeamView,
      meta: { 
        requiresAuth: true,
        onlyAdmin: true
      }
    },
    {
      path: '/app/team',
      name: 'teamEdition',
      component: TeamView,
      meta: { 
        requiresAuth: true,
        onlyAdmin: true
      }
    },
    {
      path: '/app/users',
      name: 'users',
      component: UsersView,
      meta: { requiresAuth: true }
    },
    {
      path: '/app/user/:id',
      name: 'user',
      component: UserView,
      meta: { 
        requiresAuth: true,      
      }
    },
    {
      path: '/app/user',
      name: 'userCreation',
      component: CreationView,
      meta: { 
        requiresAuth: true,
        onlyAdmin: true
      }
    },
    {
      path: '/app/workingtime/:userId/:id',
      name: 'workingtime',
      component: WorkingTime,
      meta: { requiresAuth: true }
    },
    {
      path: '/app/team/addUser',
      name: 'useraddteamview',
      component: UserAddTeamView,
      meta: { requiresAuth: true }
    },

  ]
})

router.beforeEach(async (to, from, next) => {
  try {
    console.log('from: ', from);
    console.log('to: ', to);
    // Check if the user is authenticated
    const authenticated = await is_authenticated();

    console.log('authenticated in router: ', authenticated); 
    if (to.meta.requiresAuth && !authenticated) {
      console.log('Redirecting to login');
      // User is not authenticated, redirect to login
      return next("/login");
    }
    
    if ((to.path === "/login" || to.path === "/register" || to.path === "/") && authenticated) {
      console.log('Redirecting to /')
      // User is authenticated and trying to access login, redirect to dashboard
      return next("/app");
    }

    console.log('Passed controls: ');

    return next();
  } catch (err) {
    alert('server is down');
  }
});

async function is_authenticated() {
  try {
    return store.token !== null;
  } catch (err) {
    return false;
  }
}

export default router
