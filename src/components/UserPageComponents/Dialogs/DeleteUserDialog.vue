<template>
  <v-dialog :model-value="modelValue" persistent max-width="400">
    <v-card rounded="lg">
      <v-toolbar color="primary">
        <v-toolbar-title>Delete User</v-toolbar-title>
        <v-spacer />
        <v-icon @click="DeleteUserDialogclose()">mdi-close</v-icon>
      </v-toolbar>

      <v-card-text> Are you sure you want to delete this user? </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn class="fontVariant1" variant="outlined" @click="DeleteUserDialogclose">Cancel</v-btn>
        <v-btn class="fontVariant1" color="error" variant="flat" @click="DeleteUserDialogconfirm"
          >Delete</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    modelValue: Boolean,
    user: Object,
  },
  emits: ["update:modelValue", "confirm"],
  methods: {
    DeleteUserDialogclose() {
      this.$emit("update:modelValue", false);
    },
    DeleteUserDialogconfirm() {
      this.$emit("confirm", this.user);
      this.DeleteUserDialogclose();
    },
  },
};
</script>
