<template>
  <v-dialog :model-value="CreateEditUserDialog" persistent max-width="400px">
    <v-card rounded="lg">
      <SnackbarComp :snackbarComponent="snackbarComponent"></SnackbarComp>
      <v-toolbar color="primary">
        <v-toolbar-title>
          <v-icon>{{
            StoreObj.action === "CREATE" ? "mdi-plus" : "mdi-pencil"
          }}</v-icon>
          {{ StoreObj.action === "CREATE" ? "Create" : "Edit" }} User
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon @click="CreateEditUserDialogEmit(1)" :disabled="btnLoading"
          >mdi-close</v-icon
        >
      </v-toolbar>
      <v-card-text class="pa-3">
        <v-form ref="form">
          <v-row no-gutters>
            <v-col cols="12">
              <v-text-field
                variant="outlined"
                color="primary"
                class="mx-2"
                label="User Name*"
                density="comfortable"
                :rules="[(v) => !!v || 'User Name is required']"
                v-model="createOrganizationUserInput.user_name"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                variant="outlined"
                color="primary"
                class="mx-2"
                label="User EmailID*"
                density="comfortable"
                :rules="[
                  (v) => !!v || 'Email is required',
                  (v) => /.+@.+\..+/.test(v) || 'Enter a valid email address',
                ]"
                v-model="createOrganizationUserInput.user_email_id"
                :disabled="StoreObj.action === 'UPDATE'"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea
                variant="outlined"
                color="primary"
                class="mx-2"
                label="Address*"
                density="comfortable"
                :rules="[(v) => !!v || 'Address is required']"
                v-model="createOrganizationUserInput.address"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="mr-5 pb-4">
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          @click="CreateEditUserDialogEmit(1)"
          class="fontVariant1"
          :disabled="btnLoading"
          color="redBtnColor"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="validateCreateEditFormMethod()"
          class="fontVariant1"
          :loading="btnLoading"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { UserMutations } from "@/mixins/UserManagement/CreateUpdateUser";
import SnackbarComp from "@/components/Extras/SnackbarComp.vue";

export default {
  props: {
    CreateEditUserDialog: Boolean,
    StoreObj: Object,
  },
  components: {
    SnackbarComp,
  },
  emits: ["clicked"],
  mixins: [UserMutations],
  data() {
    return {
      btnLoading: false,
      snackbarComponent: {
        snackBarModel: false,
        color: "",
        message: "",
      },
      createOrganizationUserInput: {
        user_id: null,
        user_name: "",
        user_email_id: "",
        address: "",
      },
    };
  },
  watch: {
    CreateEditUserDialog(value) {
      if (value && this.StoreObj.action === "UPDATE") {
        this.createOrganizationUserInput = {
          user_id: this.StoreObj.user_id,
          user_name: this.StoreObj.user_name,
          user_email_id: this.StoreObj.user_email_id,
          address: this.StoreObj.address,
        };
      }
    },
  },
  methods: {
    showSnackBar(color, message) {
      this.snackbarComponent.snackBarModel = true;
      this.snackbarComponent.color = color;
      this.snackbarComponent.message = message;
      setTimeout(() => {
        this.snackbarComponent.snackBarModel = false;
      }, 2500);
    },
    async validateCreateEditFormMethod() {
      const isValid = await this.$refs.form.validate();
      if (isValid.valid) {
        await this.createEditUserAPiMethod();
      } else {
        this.showSnackBar(
          "error",
          "Fields marked with asterisks * are mandatory",
        );
      }
    },
    async createEditUserAPiMethod() {
      this.btnLoading = true;
      let result;
      try {
        //         const mutattionName =
        //   this.StoreObj.action === "CREATE" ? createOrganizationUser :  editUser;

        // const mutationResult = this.StoreObj.action === "CREATE" ? "createOrganizationUser" : "editUser";
        // const result = await client.graphql({
        //   query: mutattionName,
        //   variables: {
        //     input: {
        //       user_name: this.createOrganizationUserInput.user_name,
        //       user_email_id: this.StoreObj.action === "CREATE" ? this.createOrganizationUserInput.user_email_id : undefined,
        //       target_user_id: this.StoreObj.action === "UPDATE" ? this.createOrganizationUserInput.user_id : undefined,
        //       address: this.createOrganizationUserInput.address,
        //     }

        //   }
        // })
        // create flow
        if (this.StoreObj.action === "CREATE") {
          result = await this.CreateUserMethod({
            user_name: this.createOrganizationUserInput.user_name,
            user_email_id: this.createOrganizationUserInput.user_email_id,
            address: this.createOrganizationUserInput.address,
          });
        }
        if (this.StoreObj.action === "UPDATE") {
          result = await this.UpdateUserMethod(
            {
              target_user_id: this.createOrganizationUserInput.user_id,
              user_name: this.createOrganizationUserInput.user_name,
              address: this.createOrganizationUserInput.address,
            },
            this.StoreObj.editRole,
          );
        }
        console.log(result, "r");

        if (result?.status === "SUCCESS" || result?.status === "user updated") {
          this.showSnackBar("success", result.status_message);
          setTimeout(() => {
            this.CreateEditUserDialogEmit(2);
          }, 1000);
        }
      } catch (error) {
        this.showSnackBar("error", error.errors[0].status_message);
      } finally {
        this.btnLoading = false;
      }
    },

    CreateEditUserDialogEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
