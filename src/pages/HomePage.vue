<template>
  <v-container
    fluid
    class="d-flex flex-column align-center"
    style="height: 100%"
  >
    <p class="display-2">Home Page</p>
    <p class="display-2">Hello {{ hello }}!</p>
    <v-btn @click="logout()"> Logout </v-btn>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },

  computed: {
    ...mapGetters(["user"]),

    hello() {
      return this.user != null ? this.user.name : "";
    },
  },
};
</script>
