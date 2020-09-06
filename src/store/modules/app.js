import Cookies from 'js-cookie';

const app = {
  state: {
    sidebar: {
      opend: !+Cookies.get('sidebarStatus'),
    },
    device: 'desktop',
  },
  mutations: {
    TOGGLE_SIDBAR: (state) => {
      if (state.sidebar.opend) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
      state.sidebar.opend = !state.sidebar.opend;
    },
    CLOSE_SIDEBAR: (state) => {
      Cookies.set('sidebarStatus', 1);
      state.sidebar.opend = false;
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device;
    },
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR');
    },
    CloseSideBar({ commit }) {
      commit('CLOSE_SIDEBAR');
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device);
    },
  },
};

export default app;
