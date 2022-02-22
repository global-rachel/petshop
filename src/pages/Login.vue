<template>
  <Modal>
    <template v-slot:modal-content>
      <div class="w-100 d-flex flex-column align-center">
        <Logo />
        <h5 class="text-h5 mt-6">Log in</h5>
      </div>
      <v-form class="mt-6">
        <v-text-field
          v-model="email"
          :rules="[rules.email]"
          outlined
          label="Email address*"
          type="email"
          rows="1"
          row-height="15"
        ></v-text-field>
        <v-textarea
          v-model="password"
          :rules="[rules.password, rules.length(6)]"
          auto-grow
          outlined
          label="Password*"
          type="password"
          rows="1"
          row-height="15"
        ></v-textarea>
        <v-checkbox color="primary">
          <template v-slot:label> Remember me </template>
        </v-checkbox>
        <v-btn class="mt-9" color="primary" block> LOG IN </v-btn>
      </v-form>
      <div class="w-100 d-flex justify-space-between mt-8">
        <a href="#" class="info--text">Forgot password? </a>
        <a href="#" class="info--text">Don’t have an account? Sign Up</a>
      </div>
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
  data: () => ({
    email: null,
    password: null,
    rules: {
      email: (v) => !!(v || "").match(/@/) || "Please enter a valid email",
      length: (len) => (v) =>
        (v || "").length >= len || `Invalid character length, required ${len}`,
      password: (v) =>
        !!(v || "").match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/
        ) ||
        "Password must contain an upper case letter, a numeric character, and a special character",
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
