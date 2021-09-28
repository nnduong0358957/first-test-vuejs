<template>
  <v-container fluid class="grey lighten-3 d-flex" style="height: 100%">
    <v-card class="ma-auto py-2" min-width="460" rounded="xl">
      <div class="mx-5 mb-2">
        <v-card-title
          class="font-weight-bold d-flex flex-column align-center"
          style="font-size: 26px"
        >
          Đăng nhập
        </v-card-title>

        <v-card-text>
          <v-form class="mx-10" v-model="isFormValid" @submit.prevent="login()">
            <v-text-field
              class="rounded-lg"
              v-model="phoneOrEmail"
              :rules="rules.email"
              placeholder="Số điện thoại/Email"
              validate-on-blur
              required
              outlined
              dense
              type="text"
              prepend-inner-icon="mdi-account-outline"
              append-icon=" "
            ></v-text-field>
            <v-text-field
              class="rounded-lg"
              v-model="password"
              :rules="rules.pass"
              :type="showPass ? 'text' : 'password'"
              placeholder="Mật khẩu"
              validate-on-blur
              required
              outlined
              dense
              prepend-inner-icon="mdi-lock-outline"
              :append-icon="
                showPass ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
              "
              @click:append="showPass = !showPass"
            >
            </v-text-field>

            <v-btn
              class="light-green accent-4 white--text font-weight-bold"
              block
              type="submit"
              :disabled="!isFormValid"
            >
              Đăng nhập
            </v-btn>
          </v-form>
        </v-card-text>

        <v-card-actions class="d-flex justify-center">
          <v-btn
            class="body-2 font-weight-medium grey--text"
            style="text-transform: none !important; margin-top: -16px"
            text
          >
            Quên mật khẩu?
          </v-btn>
        </v-card-actions>
        <v-card-actions class="d-flex justify-center">
          <v-btn
            to="/register"
            class="body-2 font-weight-medium"
            style="text-transform: none !important;"
            text
          >
            Đăng ký Tài khoản mới
            <v-icon class="ml-2" size="20">mdi-arrow-right</v-icon>
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
    <Dialog :msg="msgDialog" />
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import Dialog from "../components/dialog.vue";

export default {
  components: { Dialog },

  data: () => ({
    showPass: false,
    isFormValid: false,
    phoneOrEmail: "",
    password: "",
    msgDialog: "",
    rules: {
      email: [
        (v) => !!v || "Bạn chưa nhập Số điện thoại/Email",
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          /(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(v) ||
          "Số điện thoại hoặc Email không hợp lệ",
      ],
      pass: [(v) => !!v || "Bạn chưa nhập Mật khẩu"],
    },
  }),

  computed: {
    ...mapGetters(["allUsers"]),
  },

  methods: {
    ...mapMutations(["setUser", "showDialog"]),

    login() {
      // Tìm user đăng nhập trong db
      const user = this.allUsers.find(
        (e) =>
          (e.email == this.phoneOrEmail || e.phone == this.phoneOrEmail) &&
          e.password == this.password
      );

      // Nếu tìm thấy thì đăng nhập thành công => set Token và chuyển tới trang Home
      if (user) {
        //Set token to Local storage and go to Home Page
        const token = JSON.stringify({
          email: user.email,
          phone: user.phone,
          password: user.password,
        });

        this.setUser(user);

        localStorage.setItem("token", token);
        this.$router.push("/");
      } else {
        // Show dialog
        this.msgDialog =
          "Sai Số điện thoại/Email hoặc mật khẩu. Vui lòng kiểm tra lại!";
        this.showDialog("error");
      }
    },
  },
};
</script>
