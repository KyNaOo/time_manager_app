import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserView from '../views/UserView.vue'
import UsersView from '../views/UsersView.vue'
import WorkingTime from '@/views/WorkingTimeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProfileView from '@/views/ProfileView.vue'

import axios from '@/api/axios'
import { store } from '@/api/store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      component: ProfileView
    },
    {
      path: '/app/users',
      name: 'users',
      component: UsersView
    },
    {
      path: '/app/user/:id',
      name: 'user',
      component: UserView
    },
    {
      path: '/app/user',
      name: 'userEdition',
      component: UserView
    },
    {
      path: '/app/workingtime/:userId/:id',
      name: 'workingtime',
      component: WorkingTime
    },

  ]
})

router.beforeEach(async (to, from) => {
  try {
    const authenticated = await is_authenticated();
    if (to.meta.requiresAuth && !authenticated) {
      // User is not authenticated, redirect to login
      return { path: "/login" };
    }
    if ((to.path === "/login" || to.path === "/register") && authenticated) {
      // User is authenticated and trying to access login, redirect to dashboard
      return { path: "/" };
    }
  } catch (err) {
    alert('server is down');
  }
});

async function is_authenticated() {
  try {
    const response = await axios.get("profile/");
    store.updateName(response.data.username);
    return true;
  } catch (err) {
    return false;
  }
}

export default router
