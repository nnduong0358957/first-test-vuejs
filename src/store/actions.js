import axios from "axios";
// import router from "../router.js";

const apiUsers = "http://localhost:3000/users";

export default {
  async getUserFromToken(context) {
    const token = await localStorage.getItem("token");
    if (token != null) {
      const data = JSON.parse(token);
      const user = context.rootState.allUsers.find(
        (e) =>
          (e.email == data.email || e.phone == data.phone) &&
          e.password == data.password
      );

      context.commit("setUser", user);
    }
  },

  async getAllUsers(context) {
    try {
      const res = await axios.get(apiUsers);

      context.commit("setAllUsers", res.data);
    } catch (e) {
      console.error(e);
    }
  },
};
