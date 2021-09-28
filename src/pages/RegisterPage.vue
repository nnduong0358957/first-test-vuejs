<template>
  <v-container fluid class="grey lighten-3 d-flex" style="height: 100%">
    <v-card class="ma-auto py-2" min-width="460" rounded="xl">
      <div class="mx-5 mb-2">
        <v-card-title
          class="font-weight-bold d-flex flex-column align-center"
          style="font-size: 26px"
        >
          Tạo tài khoản mới
        </v-card-title>

        <v-card-text>
          <v-form
            class="mx-10"
            v-model="isFormValid"
            @submit.prevent="register()"
          >
            <div
              v-for="(item, index) in form"
              :key="index"
              style="margin-bottom: -12px"
            >
              <span v-if="item.isRequired" class="red--text mr-1">*</span>
              <span>{{ item.label }}</span>
              <v-text-field
                class="rounded-lg mt-1"
                v-model="item.model"
                :rules="
                  item.id != 'confirmPass'
                    ? rules[item.id]
                    : rules[item.id].concat(passwordConfirmationRule)
                "
                validate-on-blur
                required
                outlined
                dense
                autocomplete="new-password"
                :type="
                  item.isPass ? (item.showPass ? 'text' : 'password') : 'text'
                "
                :append-icon="
                  item.isPass
                    ? item.showPass
                      ? 'mdi-eye-outline'
                      : 'mdi-eye-off-outline'
                    : ''
                "
                @click:append="item.showPass = !item.showPass"
              />
            </div>

            <v-row class="align-center flex-wrap ma-0">
              <v-checkbox :rules="rules.checkbox" required>
                <template slot="label">
                  Nhấn "Tiếp tục" là bạn đã đồng ý với&nbsp;
                  <a
                    class="blue--text text-decoration-underline"
                    href=""
                    target="_blank"
                  >
                    Chính sách Sử dụng
                  </a>
                  &nbsp;của chúng tôi.
                </template>
              </v-checkbox>
            </v-row>

            <v-btn
              class="light-green accent-4 white--text font-weight-bold"
              :disabled="!isFormValid"
              type="submit"
              block
            >
              Tiếp tục
            </v-btn>
          </v-form>
        </v-card-text>

        <v-card-actions class="d-flex justify-center">
          <v-btn
            to="/login"
            class="body-2 font-weight-medium"
            style="text-transform: none !important;"
            text
          >
            <v-icon class="mr-2" size="20">mdi-arrow-left</v-icon>
            Quay lại Đăng nhập
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
import axios from "axios";

const apiUsers = "http://localhost:3000/users";

export default {
  components: { Dialog },

  data: () => ({
    isFormValid: false,
    msgDialog: "",
    newUser: {},
    isRegisted: false,
    form: [
      { id: "name", label: "Tên đầy đủ", model: "", isRequired: true },
      { id: "phone", label: "Số điện thoại", model: "", isRequired: true },
      {
        id: "email",
        label: "Email (Không bắt buộc)",
        model: "",
        isRequired: false,
      },
      {
        id: "password",
        label: "Mật khẩu",
        isPass: true,
        model: "",
        isRequired: true,
        showPass: false,
      },
      {
        id: "confirmPass",
        label: "Xác nhận mật khẩu",
        isPass: true,
        model: "",
        isRequired: true,
        showPass: false,
      },
    ],
    rules: {
      name: [(v) => !!v || "Bạn chưa nhập Tên đầy đủ"],
      phone: [
        (v) => !!v || "Bạn chưa nhập Số điện thoại",
        (v) =>
          !v ||
          /(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(v) ||
          "Số điện thoại không hợp lệ",
      ],
      email: [
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Email không hợp lệ",
      ],
      password: [
        (v) => !!v || "Bạn chưa nhập Mật khẩu",
        (v) => !v || v.length >= 6 || "Mật khẩu phải có ít nhất 6 ký tự",
      ],
      confirmPass: [(v) => !!v || "Bạn chưa nhập Mật khẩu"],
      checkbox: [(v) => !!v || "Bạn phải đồng ý để hoàn tất việc Đăng ký"],
    },
  }),

  computed: {
    ...mapGetters(["allUsers", "dialog"]),

    passwordConfirmationRule() {
      return () =>
        !this.findModel("confirmPass") ||
        this.findModel("confirmPass") === this.findModel("password") ||
        "Mật khẩu xác nhận phải giống với Mật khẩu";
    },
  },

  watch: {
    // Chờ 'Dialog thông báo Thành công' được tắt rồi thì mới chuyển tới trang Home
    "dialog.success"(newValue) {
      if (!newValue && this.isRegisted) {
        this.$router.push("/");
      }
    },
  },

  methods: {
    ...mapMutations(["showDialog", "setAllUsers", "setUser"]),

    async register() {
      this.checkDuplicate();

      // Không có lỗi thì lưu user mới vào db
      if (this.msgDialog != "") {
        this.showDialog("error");
      } else {
        try {
          const res = await axios.post(apiUsers, this.newUser);

          this.setAllUsers([...this.allUsers, res.data]);
          this.setUser(this.newUser);

          const token = JSON.stringify({
            email: this.newUser.email,
            phone: this.newUser.phone,
            password: this.newUser.password,
          });
          localStorage.setItem("token", token);

          this.isRegisted = true;
          this.msgDialog = "Đăng ký thành công!";
          this.showDialog("success");
        } catch (e) {
          console.error(e);
          this.msgDialog = "Đăng ký Không thành công!";
          this.showDialog("error");
        }
      }
    },

    checkDuplicate() {
      // Lấy thông tin nhập từ form
      this.form.forEach((e, index) => {
        if (index == 0) {
          this.newUser["id"] = "";

          if (e.id != "confirmPass") {
            this.newUser[e.id] = e.model;
          }
        } else {
          if (e.id != "confirmPass") {
            this.newUser[e.id] = e.model;
          }
        }
      });

      // Nếu SĐT/Email bị đã được đăng ký thì báo lỗi
      // Tìm User bị trùng
      const duplicateUser = this.allUsers.find((e) => {
        return (
          // Email không bắt buộc nên nếu "" thì bỏ qua
          (this.newUser.email != "" && e.email == this.newUser.email) ||
          e.phone == this.newUser.phone
        );
      });

      // Nếu tìm thấy User bị trùng thì báo lỗi bị trùng chỗ nào
      if (duplicateUser != null) {
        if (duplicateUser.phone == this.newUser.phone) {
          this.msgDialog = "Số điện thoại này đã được đăng ký rồi";
        } else if (duplicateUser.email == this.newUser.email) {
          this.msgDialog = "Email này đã được đăng ký rồi";
        }
      } else {
        this.msgDialog = "";

        //Thêm ID cho newUser
        this.newUser["id"] = btoa(this.newUser.phone);
      }
    },

    // Tìm value input được nhập
    findModel(name) {
      return this.form.find((e) => e.id == name).model;
    },
  },
};
</script>
