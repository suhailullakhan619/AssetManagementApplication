<template>
  <v-dialog v-model="model" max-width="420" persistent>
    <v-card rounded="lg">
      <v-toolbar color="primary">
        <v-toolbar-title>Confirm Logout</v-toolbar-title>
        <v-icon @click="LogoutDialogclose">mdi-close</v-icon>
      </v-toolbar>

      <v-card-text> Are you sure you want to logout? </v-card-text>

      <v-card-actions class="pa-3">
        <v-spacer />

        <v-btn
          variant="outlined"
          color="redBtnColor"
          @click="LogoutDialogclose"
          class="fontVariant1"
        >
          Cancel
        </v-btn>

        <v-btn class="fontVariant1" color="primary" variant="flat" @click="confirm"> Logout </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    modelValue: Boolean,
  },
  emits: ["update:modelValue", "confirm"],
  computed: {
    model: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
  },
  methods: {
    LogoutDialogclose() {
      this.model = false;
    },
    confirm() {
      this.$emit("confirm");
      this.model = false;
    },
  },
};
</script>
