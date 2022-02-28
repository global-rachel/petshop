<template>
  <v-app id="inspire">
    <Header />
    <router-view />
    <Login v-if="isLoginModalOpen" />
  </v-app>
</template>

<script>
import Header from "@/components/Header.vue";
import Login from "@/pages/Login.vue";
export default {
  name: "App",
  components: { Header, Login },
  data: () => ({}),
  computed: {
    isLoginModalOpen() {
      return this.$store.state.isLoginModalOpen;
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/styles/common";
</style>
