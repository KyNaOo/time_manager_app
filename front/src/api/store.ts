// store.js
import { reactive } from 'vue';

export const store = reactive({
  username: null as string | null,
  updateName(name : string | null) {
    this.username = name;
  },
  hasLogin: false,
  updateHasLogin(value : boolean) {
    this.hasLogin = value;
  }
})