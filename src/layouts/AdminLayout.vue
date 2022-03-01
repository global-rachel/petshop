<template>
  <div>
    <v-navigation-drawer
      v-model="isSideMenuOpen"
      fixed
      :temporary="$isMobile()"
      :permanent="!$isMobile()"
      color="light"
      :width="sideNavWidth"
      class="navigation-wrapper"
    >
      <v-list>
        <v-hover
          v-for="{ name, icon } in links"
          :key="icon"
          link
          v-slot="{ hover }"
        >
          <v-list-item
            class="transition"
            :class="hover || isCurrentPage(name) ? 'dark white--text' : ''"
            link
          >
            <v-list-item-icon>
              <v-icon :color="hover || isCurrentPage(name) ? 'white' : ''">{{
                icon
              }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-hover>
      </v-list>
      <div v-if="$isMobile()" class="w-100 d-flex justify-center">
        <v-btn
          v-if="!$store.getters.isLogin"
          outlined
          color="primary"
          @click="login()"
          height="48"
        >
          LOGIN
        </v-btn>
        <v-btn
          v-if="$store.getters.isLogin"
          outlined
          color="primary"
          @click="logout()"
          height="48"
        >
          LOGOUT
        </v-btn>
        <v-avatar size="48" outlined color="white" class="ml-4 avatar">
          <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
        </v-avatar>
      </div>
    </v-navigation-drawer>

    <v-main>
      <div :class="mainWrapperClass"><router-view /></div>
    </v-main>
  </div>
</template>

<script>
import publicStyles from "@/assets/styles/common.scss";
export default {
  data: () => ({
    sideNavWidth: publicStyles.sideNavWidth,
    links: [
      { name: "Dashboard", icon: "mdi-tune" },
      { name: "All Tickets", icon: "mdi-subtitles" },
      { name: "Shipment Locatior", icon: "mdi-map-marker" },
      { name: "Customers", icon: "mdi-account-multiple-outline" },
      { name: "Products", icon: "mdi-folder-outline" },
    ],
  }),
  methods: {
    isCurrentPage(name) {
      return this.$route.name == name;
    },
    login() {
      this.$store.commit("setLoginModalOpen", true);
    },
    logout() {
      this.$store.dispatch("logout");
    },
  },
  computed: {
    mainWrapperClass() {
      return this.$isMobile() ? "main-wrapper" : "main-wrapper--mobile";
    },
    isSideMenuOpen: {
      get() {
        return !this.$isMobile() || this.$store.state.isSideMenuOpen;
      },
      set() {},
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/common.scss";

.navigation-wrapper {
  padding-top: $headerHeight;
}

.main-wrapper {
  padding: 24px 40px;
  &--mobile {
    padding: 24px 40px 24px calc(40px + #{$sideNavWidth});
  }
}
</style>
