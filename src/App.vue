<template>
  <v-app id="inspire">
    <Header />
    <router-view />
    <Teleport to="body">
      <Login v-if="isModalOpen" />
    </Teleport>
  </v-app>
</template>

<script>
import Header from "@/components/Header.vue";
import Login from "@/pages/Login.vue";
export default {
  name: "App",
  components: { Header, Login },
  data: () => ({
    
  }),
  computed:{
    isModalOpen(){
      return this.$store.state.isModalOpen
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/styles/common";
</style>
