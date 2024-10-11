import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserView from '../views/UserView.vue'
import UsersView from '../views/UsersView.vue'
import WorkingTimes from '@/components/WorkingTimes.vue'
import WorkingTime from '@/components/WorkingTime.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView
    },
    {
      path: '/user/:id',
      name: 'user',
      component: UserView
    },
    {
      path: '/user',
      name: 'userEdition',
      component: UserView
    },
    {
      path: '/workingtime/:userId',
      name: 'workingtime',
      component: WorkingTime
    },

  ]
})

export default router
