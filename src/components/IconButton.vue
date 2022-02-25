<template>
  <v-btn
    small
    fab
    elevation="0"
    class="my-5"
    :class="classString"
    :color="color"
    :style="btnStyle"
    :width="width"
    :height="height"
    @click="btnClick()"
  >
    <v-icon :size="iconSize"> {{ icon }} </v-icon></v-btn
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
    width: { type: Number },
    height: { type: Number },
    iconSize: { type: Number },
  },
  methods: {
    btnClick() {
      this.$emit("btnClick");
    },
  },
};
</script>
