<template>
  <div>
    <v-dialog v-model="dialog.error" width="500" @click:outside="hideDialog()">
      <v-card>
        <v-card-title class="font-weight-bold red--text display-1">
          Lỗi
        </v-card-title>
        <v-card-text class="red--text title">
          {{ msg }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="hideDialog()">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialog.success"
      width="500"
      @click:outside="hideDialog()"
    >
      <v-card>
        <v-card-title class="font-weight-bold green--text display-1">
          Thành công
        </v-card-title>
        <v-card-text class="title">
          {{ msg }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="hideDialog()">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  props: {
    msg: String,
  },
  computed: {
    ...mapGetters(["dialog"]),
  },
  methods: {
    ...mapMutations(["setUser", "setToken", "hideDialog"]),
  },
};
</script>
