import { computed, reactive, ref } from 'vue';
import type { User } from '@/types/crudTypes'
import { useApi } from './index';
import {useAuth} from "./auth";

const auth = useAuth();
const api = useApi();

export const store = reactive({

  modal: null as { message: string, title: string} | null,
  token: localStorage.getItem('token') as string | null,
  setToken(token: string | null) {
    this.token = token;
  } ,
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
  showModal( value: any) {
    this.modal = value;
  },
  hideModal () {
    this.modal = null;
  },
  
    
})