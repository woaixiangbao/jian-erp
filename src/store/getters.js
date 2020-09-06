const getters = {
  sidebar: (state) => state.app.sidevar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  username: (state) => state.user.username,
};

export default getters;
