<template>
  <Modal :modalStyle="'padding: 50px 73px;'">
    <template v-slot:modal-content>
      <div class="w-100 d-flex flex-column align-center">
        <Logo />
        <h5 class="text-h5 mt-6">Log in</h5>
      </div>
      <v-form class="mt-6">
        <v-text-field
          v-model="form.email"
          ref="email"
          :rules="[rules.email]"
          outlined
          label="Email address*"
          type="email"
          rows="1"
          row-height="15"
        ></v-text-field>
        <v-text-field
          v-model="form.password"
          ref="password"
          :rules="[rules.password]"
          filled
          auto-grow
          outlined
          label="Password*"
          type="password"
          rows="1"
          row-height="15"
        ></v-text-field>
        <v-checkbox color="primary">
          <template v-slot:label> Remember me </template>
        </v-checkbox>
        <v-btn class="mt-9" color="primary" block @click="login()">
          LOG IN
        </v-btn>
      </v-form>
      <div class="w-100 d-flex justify-space-between mt-8">
        <a href="#" class="info--text">Forgot password? </a>
        <a href="#" class="info--text">Don’t have an account? Sign Up</a>
      </div>
      <v-snackbar v-model="snackbar" top color="red accent-2" :timeout="5000">
        {{ msg }}
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/Modal.vue";
import Logo from "@/components/Logo.vue";
export default {
  components: {
    Modal,
    Logo,
  },
  methods: {
    async login() {
      if (!(this.form.email || "").match(/@/) || !this.form.password) {
        return;
      }

      try {
        await this.$store.dispatch("login", {
          email: this.form.email,
          password: this.form.password,
        });

        this.$store.commit("setModalOpen", false);
        window.location.reload();
      } catch (error) {
        this.snackbar = true;
        this.msg = error;
      }
    },
  },
  data: () => ({
    msg: null,
    snackbar: false,
    form: {
      email: null,
      password: null,
    },
    rules: {
      email: (v) => !!(v || "").match(/@/) || "Please enter a valid email",
      length: (len) => (v) =>
        (v || "").length >= len || `Invalid character length, required ${len}`,
      password: (v) => !!(v || "") || "Please enter a valid password",
      required: (v) => !!v || "This field is required",
    },
  }),
};
</script>
<style lang="scss" scoped>
a {
  font-size: 14px;
}
</style>
