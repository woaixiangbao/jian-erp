const user = {
  state: {
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
  },
  mutations: {
    BIND_LOGIN: (state, data) => {
      localStorage.setItem('token', data);
      state.token = data;
    },
    BIND_LOGOUT: (state) => {
      localStorage.removeItem('token');
      state.token = null;
    },
    SAVE_USER: (state, data) => {
      localStorage.setItem('username', data);
      state.username = data;
    },
  },
};

export default user;
