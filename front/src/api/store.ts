// store.js
import { computed, reactive } from 'vue';
import type { User } from '@/types/crudTypes'


export const store = reactive({
  // username: null as string | null,
  // email: null as string | null,
  user: computed(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) as User : null;
  }),
  hasLogin: computed(() => {
    return localStorage.getItem('user') !== null;
    }),
})