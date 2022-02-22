<template>
  <div class="modal" v-show="modelValue">
    <div class="modal-background" @click.self="turnOffModal">
      <v-card class="modal-area" rounded="6px">
        <v-icon class="x-button" size="14px" @click.prevent="turnOffModal">
          mdi-close
        </v-icon>
        <div class="modal-content">
          <slot name="modal-content" />
        </div>
      </v-card>
    </div>
  </div>
</template>
<script>
export default {
  props: [],
  data: () => ({
    isSuccess: false,
    isLoading: false,
    modelValue: true,
    title: "Log In",
  }),
  computed: {},
  methods: {
    turnOffModal: function () {
      this.$store.commit("setModalOpen", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.modal {
  position: fixed;
  z-index: 998;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100%;
}

.modal-background {
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}

.modal-area {
  width: 542px;
  min-height: 600px;
  margin: 5% auto;
  position: relative;
  padding: 50px 73px;
  border-radius: 6px !important;

  .x-button {
    position: absolute;
    top: 30px;
    right: 30px;
  }
}
</style>
