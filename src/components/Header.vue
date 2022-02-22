<template>
  <v-app-bar app color="primary" flat :height="height">
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
        <v-btn outlined color="white" class="ma-2">
          <v-icon left> mdi-cart </v-icon>
          CART(0)
        </v-btn>
        <v-btn outlined color="white" @click="login()"> LOGIN </v-btn>
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
  },
};
</script>
