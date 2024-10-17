// store.js
import { computed, reactive, ref } from 'vue';
import type { User } from '@/types/crudTypes'
import { useApi } from './index';
import {useAuth} from "./auth";

const auth = useAuth();
const api = useApi();

export const store = reactive({
  // username: null as string | null,
  // email: null as string | null,

  modal: null as { message: string, title: string} | null,
  token: computed(() => {
    const token = localStorage.getItem('token');
    return token ? token : null;
  }),
  user: computed(async () => {
    const token = store.token;
    if (!token) {
      return null;
    }
    const decodedToken = auth.getUserFromToken(token);
    const userId = Number(decodedToken?.decoded.sub);
    console.log('userId: ', userId);
    if (isNaN(userId)) {
      return null;
    }
    return await api.getUser(userId);
  }),
  hasLogin: computed(() => {
    return localStorage.getItem('token') !== null;
    }),
  showModal( value: any) {
    this.modal = value;
  },
  hideModal () {
    this.modal = null;
  }
    
})