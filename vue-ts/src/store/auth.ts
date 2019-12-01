import jwt from '@/lib/jwt';
import { authService } from '@/services';
import { User, LoginRequest } from '@/services/auth';

export type AuthState = {
  errors: any;
  user: User;
  isAuthenticated: string | boolean | null;
};

const state: AuthState = {
  errors: null,
  user: {
    email: '',
    username: '',
    token: ''
  },
  isAuthenticated: !!jwt.getToken()
};

const getters = {
  currentUser: (state: AuthState) => state.user,
  isAuthenticated: (state: AuthState) => state.isAuthenticated,
  errors: (state: AuthState) => state.errors
};

const actions = {
  login({ commit }: any, credentials: LoginRequest) {
    return new Promise(resolve => {
      authService
        .login(credentials)
        .then(({ data }) => {
          commit('setAuth', data.user);
          resolve(data.user);
        })
        .catch(({ response }) => {
          commit('setError', response.data.errors);
        });
    });
  },
  logout({ commit }: any) {
    commit('purgeAuth');
  }
};

const mutations = {
  setError(state: AuthState, error: any) {
    state.errors = error;
  },
  setAuth(state: AuthState, user: User) {
    state.isAuthenticated = true;
    state.user = user;
    state.errors = {};
    jwt.setToken(state.user.token);
  },
  purgeAuth(state: AuthState) {
    state.isAuthenticated = false;
    state.user = {
      username: '',
      token: '',
      email: ''
    };
    state.errors = {};
    jwt.destoryToken();
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
