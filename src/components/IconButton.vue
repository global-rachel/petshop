<template>
  <v-btn
    small
    fab
    elevation="0"
    class="my-5"
    :class="classString"
    :color="color"
    :style="btnStyle"
    @click="btnClick()"
  >
    <v-icon> {{ icon }} </v-icon></v-btn
  >
</template>
<script>
export default {
  emits: ["btnClick"],
  props: {
    icon: { type: String },
    color: { type: String },
    classString: { type: String },
    btnStyle: { type: String },
  },
  methods: {
    btnClick() {
      this.$emit("btnClick");
    },
  },
};
</script>
