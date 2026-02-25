<template>
  <v-dialog :model-value="modelValue" max-width="500" persistent="">
    <v-card rounded="lg">
      <SnackbarComp :snackbarComponent="snackbarComponent" />
      <v-toolbar color="primary">
        <v-toolbar-title class="font-weight-bold"> Add Role </v-toolbar-title>
        <v-icon @click="CreateRoleDialogclose">mdi-close</v-icon>
      </v-toolbar>

      <v-card-text>
        <v-form ref="formRef">
          <v-text-field
            color="blue"
            variant="outlined"
            label="Role Id"
            v-model="form.roleId"
            :rules="[rules.required]"
          />

          <v-text-field
            color="blue"
            variant="outlined"
            label="Role Name"
            v-model="form.roleName"
            :rules="[rules.required]"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="mr-4 pa-3">
        <v-spacer />
        <v-btn
          variant="outlined"
          color="redBtnColor"
          class="fontVariant1"
          @click="CreateRoleDialogclose"
          >Cancel</v-btn
        >
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="loading"
          @click="validateCreateRoleFormMethod()"
          variant="flat"
          class="fontVariant1"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { CreateRole } from "@/mixins/RoleManagement/CreateRole";
import SnackbarComp from "@/components/Extras/SnackbarComp.vue";
export default {
  name: "CreateRoleDialog",

  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    SnackbarComp,
  },
  emits: ["update:modelValue"],
  mixins: [CreateRole],
  data() {
    return {
      loading: false,
      rules: {
        required: (v) => !!v || "This field is required",
      },
      snackbarComponent: {},
    };
  },

  watch: {
    snackbarComponent(value) {
      if (value) {
        if (value.snackBarModel) {
          setTimeout(() => {
            this.snackbarComponent = {};
            this.snackbarComponent = {
              snackBarModel: false,
              color: "",
              message: "",
            };
          }, 2500);
        }
      }
    },
  },

  methods: {
    CreateRoleDialogclose() {
      this.$emit("update:modelValue", false);
      this.$refs.formRef?.reset();
    },
    async validateCreateRoleFormMethod() {
      const { valid } = await this.$refs.formRef.validate();
      if (!valid) {
        this.snackbarComponent = {};
        this.snackbarComponent = {
          snackBarModel: true,
          color: "error",
          message: "Fields marked with asterisks * are mandatory",
        };
        return;
      }

      await this.callApiMethod();
    },
    async callApiMethod() {
      this.loading = true;

      try {
        await this.CreateRoleMethod();
        this.CreateRoleDialogclose();
      } catch (e) {
        this.snackbarComponent = {
          snackBarModel: true,
          color: "error",
          message: e,
        };
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.h1 {
  font-size: 50px;
}
</style>
