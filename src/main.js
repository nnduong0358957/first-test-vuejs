import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import Vuex from "vuex";
import router from "./router";
import storeConfigs from "./store";

Vue.config.productionTip = false;

Vue.use(Vuex);
const store = new Vuex.Store(storeConfigs);

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
