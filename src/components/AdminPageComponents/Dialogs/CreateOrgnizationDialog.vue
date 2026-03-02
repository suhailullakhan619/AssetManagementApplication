<template>
  <!-- CREATE ORGANIZATION DIALOG -->
  <v-dialog persistent="" :model-value="modelValue" max-width="600">
    <v-card rounded="lg">
      <SnackbarComp :snackbarComponent="snackbarComponent" />
      <v-toolbar color="primary">
        <v-toolbar-title class="font-weight-bold">
          Create Organization
        </v-toolbar-title>
        <v-icon @click="CreateOrgnizationDialogclose">mdi-close</v-icon>
      </v-toolbar>

      <v-card-text>
        <v-form ref="formRef" >
          <v-text-field
            color="blue"
            variant="outlined"
            label="Organization Name"
            v-model="orgForm.org_name"
            :rules="[rules.required]"
          />

          <v-text-field
            color="blue"
            variant="outlined"
            label="Organization Type"
            v-model="orgForm.org_type"
          />

          <v-text-field
            color="blue"
            variant="outlined"
            label="Organization Email"
            v-model="orgForm.org_email"
            type="email"
            :rules="[rules.email]"
          />

          <v-divider class="my-4" />

          <h4 class="mb-2">Owner Details</h4>

          <v-text-field
            color="blue"
            variant="outlined"
            label="Owner Name"
            v-model="orgForm.org_owner_name"
            :rules="[rules.required]"
          />

          <v-text-field
            color="blue"
            variant="outlined"
            label="Owner Email"
            v-model="orgForm.org_owner_email"
            type="email"
            :rules="[rules.required, rules.email]"
          />

          <v-text-field
            color="blue"
            variant="outlined"
            label="Owner Password"
            v-model="orgForm.org_owner_password"
            type="password"
            :rules="[rules.required, rules.password]"
          />

          <v-textarea
            color="blue"
            variant="outlined"
            label="Address"
            v-model="orgForm.address"
            rows="2"
            :rules="[rules.required]"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="mr-3 pa-3">
        <v-spacer />
        <v-btn
          variant="outlined"
          @click="CreateOrgnizationDialogclose"
          class="fontVariant1"
          color="redBtnColor"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="loading"
          variant="flat"
          @click="validatecreateOrganizationdialog"
          class="fontVariant1"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import SnackbarComp from "@/components/Extras/SnackbarComp.vue";
import { CreateOrganisation } from "@/mixins/OrganisationManagement/CreateOrganisation";
export default {
  name: "CreateOrgnizationDialog",
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    SnackbarComp,
  },
  emits: ["update:modelValue", "success"],
  mixins: [CreateOrganisation],
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
  data() {
    return {
      loading: false,
      snackbarComponent: {},
      rules: {
        required: (v) => !!v || "This field is required",
        email: (v) => !v || /.+@.+\..+/.test(v) || "Email must be valid",
        password: (v) =>
          v.length >= 8 || "Password must be at least 8 characters",
      },
    };
  },

  methods: {
    CreateOrgnizationDialogclose() {
      this.$emit("update:modelValue", false);
      this.$refs.formRef?.reset();
    },
    async validatecreateOrganizationdialog() {
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
      await this.createOrganisationMethodApi();
    },
    async createOrganisationMethodApi() {
      this.loading = true;
      try {
     const result=await this.CreateOrganisationMethod();
  console.log('organ',result)
  if(result.status==='SUCCESS'){
 this.snackbarComponent = {
          snackBarModel: true,
          color: "success",
          message: result.status_message
||"Organization created successfully",
        };

        setTimeout(() => {
          this.CreateOrgnizationDialogclose();
        }, 1200);
  }else{
     this.snackbarComponent = {
          snackBarModel: true,
          color: "error",
          message: result.status_message||'Error',
        };
  }
       
      } catch (e) {
        this.snackbarComponent = {
          snackBarModel: true,
          color: "error",
          message: e.errors[0].message || "failed to create organization",
        };
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style lang=""></style>
