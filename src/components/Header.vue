<template>
  <v-app-bar
    app
    color="primary"
    flat
    :height="height"
    class="header"
    :z-index="999"
  >
    <v-container
      class="py-0 fill-height d-flex justify-space-between"
      color="primary"
    >
      <div>
        <img
          src="../assets/images/logo.svg"
          alt=""
          style="width: 31px; height: 29px"
        />
        <img
          src="../assets/images/logo-text.svg"
          alt=""
          style="margin-left: 13px; width: 74px; height: 20px"
        />
      </div>

      <div>
        <v-btn v-for="link in links" :key="link.name" text class="white--text">
          {{ link.name.toUpperCase() }}
          <v-icon v-if="link.sublinks">mdi-menu-down</v-icon>
        </v-btn>
      </div>

      <div>
        <v-btn outlined color="white" class="ma-2" height="48">
          <v-icon left> mdi-cart </v-icon>
          CART(0)
        </v-btn>
        <v-btn
          v-if="!isLogin"
          outlined
          color="white"
          @click="login()"
          height="48"
        >
          LOGIN
        </v-btn>
        <v-btn
          v-if="isLogin"
          outlined
          color="white"
          @click="logout()"
          height="48"
        >
          LOGOUT
        </v-btn>
        <v-avatar
          v-if="isLogin"
          size="48"
          outlined
          color="white"
          class="ml-4 avatar"
        >
          <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
        </v-avatar>
      </div>
    </v-container>
  </v-app-bar>
</template>
<script>
import publicStyles from "@/assets/styles/common.scss";
export default {
  data: () => ({
    links: [
      { name: "products", sublinks: [{}, {}, {}] },
      { name: "promotions" },
      { name: "blog" },
    ],
    height: publicStyles.headerHeight,
  }),
  methods: {
    login() {
      this.$store.commit("setModalOpen", true);
    },
    logout() {
      this.$store.dispatch("logout");
    },
  },
  computed: {
    isLogin() {
      return this.$store.state.token && this.$store.state.token !== null;
    },
  },
};
</script>
<style lang="scss" scoped>
.avatar {
  border: 1px solid;
}

.header {
  z-index: 999 !important;
}
</style>
