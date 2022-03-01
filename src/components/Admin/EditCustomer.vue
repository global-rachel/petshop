<template>
  <Modal
    :modalStyle="'padding: 25px 48px 48px;'"
    @closeModal="closeModal()"
    :title="modalTitle"
  >
    <template v-slot:modal-content>
      <v-form ref="form" class="mt-6" lazy-validation>
        <!-- Icon -->
        <div class="d-flex w-100 justify-center">
          <IconButton
            :color="'#ECF0EF'"
            :icon="'mdi-account'"
            :classString="'grey--text'"
            :width="100"
            :height="100"
            :iconSize="50"
          />
        </div>
        <!-- Name -->
        <div class="d-flex">
          <v-text-field
            v-model="form.first_name"
            class="mr-5"
            ref="first_name"
            :rules="[checkRequired, checkLength(3)]"
            outlined
            label="First Name"
            type="first_name"
            rows="1"
            row-height="15"
          />

          <v-text-field
            v-model="form.last_name"
            ref="last_name"
            :rules="[checkRequired]"
            outlined
            label="Last Name"
            type="last_name"
            rows="1"
            row-height="15"
          />
        </div>
        <v-text-field
          v-model="form.email"
          ref="email"
          :rules="[checkEmail, checkRequired]"
          outlined
          label="Email address*"
          type="email"
          rows="1"
          row-height="15"
        />
        <v-text-field
          outlined
          label="Phone"
          v-model="form.phone_number"
          :rules="[checkRequired, checkLength(6)]"
        ></v-text-field>
        <v-text-field outlined label="Address" v-model="form.address">
          <template v-slot:append>
            <div>
              <svg
                width="18"
                height="23"
                viewBox="0 0 18 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.11 1.7701L15.78 0.100098L17.9 2.2201L16.23 3.8901L14.11 1.7701V1.7701ZM13.11 2.7701L15.23 4.8901L9.12 11.0001H7V8.8901L13.11 2.7701V2.7701ZM11.13 2.6401L5.5 8.2701V12.5101H9.74L15.36 6.8901C15.77 7.8801 16 8.9901 16 10.2101C16 13.5301 13.33 17.4601 8 22.0101C2.67 17.4601 0 13.5301 0 10.2101C0 5.2301 3.8 2.0101 8 2.0101C9.09 2.0101 10.16 2.2301 11.13 2.6401V2.6401Z"
                  fill="black"
                  fill-opacity="0.54"
                />
              </svg>
            </div>
          </template>
        </v-text-field>
        <v-text-field
          v-model="form.password"
          ref="password"
          :rules="[checkRequired, checkLength(8)]"
          filled
          auto-grow
          outlined
          label="Password*"
          type="password"
          rows="1"
          row-height="15"
          append-icon="mdi-eye"
        ></v-text-field>
        <v-text-field
          v-model="form.password_confirmation"
          ref="password"
          :rules="[isMatchingPassword, checkRequired]"
          filled
          auto-grow
          outlined
          label="Password*"
          type="password"
          rows="1"
          row-height="15"
          append-icon="mdi-eye"
        ></v-text-field>
        <v-btn class="mt-9 btn" color="primary" block @click="modalBtnClick()">
          {{ btnText }}
        </v-btn>
      </v-form>
      <v-snackbar v-model="alert" top color="red accent-2" :timeout="5000">
        {{ msg }}
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="alert = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/Modal.vue";
import IconButton from "@/components/IconButton.vue";
export default {
  emits: ["closeModal", "modalBtnClick"],
  components: {
    Modal,
    IconButton,
  },
  props: {
    modalTitle: {
      type: String,
    },
    btnText: {
      type: String,
    },
    editedItem: {
      type: Object,
    },
  },
  data: () => ({
    valid: true,
    msg: null,
    alert: false,
    form: {
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  }),
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    modalBtnClick() {
      this.$refs.form.validate();
      if (this.valid) this.$emit("modalBtnClick", this.form);
    },
    isMatchingPassword() {
      const pass = this.form.password === this.form.password_confirmation;
      if (!pass) this.valid = false;
      return pass || "Passwords does not match.";
    },
    checkEmail(v) {
      const pass = !!(v || "").match(/.+@.+/);
      if (!pass) this.valid = false;
      return pass || "Please enter a valid email";
    },
    checkLength: function (len) {
      let _this = this;
      return function (v) {
        const pass = (v || "").length >= len;
        if (!pass) _this.valid = false;
        return pass || `Invalid length, required at least ${len}`;
      };
    },
    checkRequired(v) {
      const pass = !!(v || "");
      if (!pass) this.valid = false;
      return pass || "This field is required";
    },
  },
  computed: {},
  watch: {
    editedItem: {
      handler() {
        if (!this.editedItem) return;
        this.form = this.editedItem;
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
a {
  font-size: 14px;
}

.btn {
  font-size: 15px;
}
</style>
