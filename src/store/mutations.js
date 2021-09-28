export default {
  setAllUsers(state, allUsers) {
    state.allUsers = allUsers;
  },
  setUser(state, user) {
    state.user = user;
  },
  showDialog(state, type) {
    if (type == "error") {
      state.dialog.error = true;
    } else if (type == "success") {
      state.dialog.success = true;
    }
  },
  hideDialog(state) {
    state.dialog = {
      error: false,
    };
  },
};
