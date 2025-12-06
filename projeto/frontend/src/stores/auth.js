import { defineStore } from 'pinia';
import { auth, provider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

const STORAGE_KEY = 'authStore';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.user
  },
  actions: {
    initFromStorage() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const data = JSON.parse(raw);
          this.user = data.user || null;
        } catch (e) {
          console.error('Erro ao ler authStore do localStorage', e);
        }
      }
    },
    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user: this.user
        })
      );
    },
    async signInWithGoogle() {
      this.loading = true;
      this.error = null;
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        this.user = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        };
        this.persist();
      } catch (err) {
        console.error(err);
        this.error = 'Falha ao entrar com Google.';
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      try {
        await signOut(auth);
      } catch (err) {
        console.error(err);
      } finally {
        this.user = null;
        this.persist();
      }
    }
  }
});
