<template>
  <v-overlay :model-value="overlay" position="absolute">
    <div
      class="d-flex align-center justify-center"
      style="height: 100vh !important; width: 100vw"
    >
      <v-progress-circular
        v-if="overlay"
        :size="100"
        color="primary"
        indeterminate
      >
      </v-progress-circular>
    </div>
  </v-overlay>
</template>
<script>
export default {
  props: {
    overlay: Boolean,
  },
  data() {
    return {};
  },
};
</script>
