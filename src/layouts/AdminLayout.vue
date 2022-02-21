<template>
  <div>
    <v-navigation-drawer
      absolute
      color="light"
      width="260"
      class="navigation-wrapper"
    >
      <v-list subheader="false">
        <v-hover
          v-for="{ name, icon } in links"
          :key="icon"
          link
          v-slot="{ hover }"
        >
          <v-list-item
            class="transition"
            :class="hover ? 'dark white--text' : ''"
            link
          >
            <v-list-item-icon>
              <v-icon :color="hover ? 'white' : ''">{{ icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-hover>
      </v-list>
    </v-navigation-drawer>

    <v-main> </v-main>
  </div>
</template>

<script>
import publicStyles from "@/assets/styles/common.scss";
export default {
  data: () => ({
    links: [
      { name: "Dashboard", icon: "mdi-tune" },
      { name: "All Tickets", icon: "mdi-subtitles" },
      { name: "Shipment Locatior", icon: "mdi-map-marker" },
      { name: "Customers", icon: "mdi-account-multiple-outline" },
      { name: "Products", icon: "mdi-folder-outline" },
    ],
  }),
  mounted() {
    console.log(publicStyles);
  },
};
</script>
<style lang="scss">
@import "@/assets/styles/common.scss";

.navigation-wrapper {
  padding-top: $headerHeight;
}
</style>
