// store.js
import { reactive } from 'vue';
import type { User } from '@/types/crudTypes'


export const store = reactive({
  // username: null as string | null,
  // email: null as string | null,
  user : null as any as User,
  updateUser(user: User | null) {
    this.user = user ?? { username: '', email: '' };
  },
  hasLogin: false,
  updateHasLogin(value : boolean) {
    this.hasLogin = value;
  }
})