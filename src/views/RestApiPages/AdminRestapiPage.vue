  <template>
    <v-container fluid>
      <SnackbarComp :snackbarComponent="snackbarComponent" />

      <!-- TOOLBAR -->
      <v-toolbar>
        <v-layout row wrap class="align-center ga-2">
          <v-icon color="primary" :size="mdAndUp ? 55 : 35">mdi-security</v-icon>
          <v-layout class="flex-column">
            <v-toolbar-title class="d-flex align-center">
              Admin Management
            </v-toolbar-title>
            <p class="subtitle">Manage and add Organizations, Users and Roles</p>
          </v-layout>
        </v-layout>
      </v-toolbar>

      <!-- ACTION CARDS -->
      <v-sheet class="pt-5" >
        <v-row>
          <v-col cols="12" md="6">
            <v-tooltip location="top" text="Create a new organization">
              <template #activator="{ props }">
                <v-card v-bind="props" class="pa-5 action-card" elevation="2" @click="orgDialog = true">
                  <v-icon size="36" color="primary">mdi-domain</v-icon>
                  <h3 class="mt-3">Add Organization</h3>
                  <p class="text-grey">Register a new organization in the system</p>
                </v-card>
              </template>
            </v-tooltip>
          </v-col>

          <v-col cols="12" md="6">
            <v-tooltip location="top" text="Create a new role">
              <template #activator="{ props }">
                <v-card v-bind="props" class="pa-5 action-card" elevation="2" @click="roleDialog = true">
                  <v-icon size="36" color="primary">mdi-account-key</v-icon>
                  <h3 class="mt-3">Create Role</h3>
                  <p class="text-grey">Define new roles and permissions</p>
                </v-card>
              </template>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-sheet>

      <!-- ==================== ORGANIZATION DIALOG ==================== -->
      <v-dialog v-model="orgDialog" persistent max-width="600">
        <v-card rounded="lg">
          <v-toolbar color="primary">
            <v-toolbar-title class="font-weight-bold">Create Organization</v-toolbar-title>
            <v-icon @click="closeOrgDialog" :disabled="orgLoading">mdi-close</v-icon>
          </v-toolbar>

          <v-card-text>
            <v-form ref="orgForm" v-model="orgFormValid">

              <v-text-field
                color="blue"
                variant="outlined"
                label="Organization Name"
                v-model="orgInput.org_name"
                :rules="[rules.required]"
              />

              <v-text-field
                color="blue"
                variant="outlined"
                label="Organization Type"
                v-model="orgInput.org_type"
              />

              <v-text-field
                color="blue"
                variant="outlined"
                label="Organization Email"
                v-model="orgInput.org_email"
                type="email"
                :rules="[rules.email]"
              />

              <v-divider class="my-4" />
              <h4 class="mb-2">Owner Details</h4>

              <v-text-field
                color="blue"
                variant="outlined"
                label="Owner Name"
                v-model="orgInput.org_owner_name"
                :rules="[rules.required]"
              />

              <v-text-field
                color="blue"
                variant="outlined"
                label="Owner Email"
                v-model="orgInput.org_owner_email"
                type="email"
                :rules="[rules.required, rules.email]"
              />

              <v-text-field
                color="blue"
                variant="outlined"
                label="Owner Password"
                v-model="orgInput.org_owner_password"
                type="password"
                :rules="[rules.required, rules.password]"
              />

              <v-textarea
                color="blue"
                variant="outlined"
                label="Address"
                v-model="orgInput.address"
                rows="2"
                :rules="[rules.required]"
              />

            </v-form>
          </v-card-text>

          <v-card-actions class="mr-3 pa-3">
            <v-spacer />
            <v-btn variant="outlined" color="redBtnColor" class="fontVariant1" :disabled="orgLoading" @click="closeOrgDialog">
              Cancel
            </v-btn>
            <v-btn color="primary" :loading="orgLoading" :disabled="orgLoading" variant="flat" class="fontVariant1" @click="submitOrganization">
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- ==================== ROLE DIALOG ==================== -->
      <v-dialog v-model="roleDialog" persistent max-width="500">
        <v-card rounded="lg">
          <v-toolbar color="primary">
            <v-toolbar-title class="font-weight-bold">Add Role</v-toolbar-title>
            <v-icon @click="closeRoleDialog" :disabled="roleLoading">mdi-close</v-icon>
          </v-toolbar>

          <v-card-text>
            <v-form ref="roleForm" v-model="roleFormValid">

              <v-text-field
                color="blue"
                variant="outlined"
                label="Role Id"
                v-model="roleInput.role_id"
                :rules="[rules.required]"
              />

              <v-text-field
                color="blue"
                variant="outlined"
                label="Role Name"
                v-model="roleInput.role_name"
                :rules="[rules.required]"
              />

              <v-radio-group v-model="roleInput.status">
                <v-radio label="Active" value="ACTIVE" />
                <v-radio label="Inactive" value="INACTIVE" />
              </v-radio-group>

            </v-form>
          </v-card-text>

          <v-card-actions class="mr-4 pa-3">
            <v-spacer />
            <v-btn variant="outlined" color="redBtnColor" class="fontVariant1" :disabled="roleLoading" @click="closeRoleDialog">
              Cancel
            </v-btn>
            <v-btn color="primary" :loading="roleLoading" :disabled="roleLoading" variant="flat" class="fontVariant1" @click="submitRole">
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-container>
  </template>

  <script>
  import SnackbarComp from "@/components/Extras/SnackbarComp.vue";

  export default {
    name: "AdminRestapiPage",
    components: { SnackbarComp },

    data() {
      return {
        // ── Dialogs ──
        orgDialog: false,
        roleDialog: false,

        // ── Form valid ──
        orgFormValid: false,
        roleFormValid: false,

        // ── Loading ──
        orgLoading: false,
        roleLoading: false,

        // ── Org input (same fields as your CreateOrgnizationDialog) ──
        orgInput: {
          org_name: "",
          org_type: "",
          org_email: "",
          org_owner_name: "",
          org_owner_email: "",
          org_owner_password: "",
          address: "",
        },

        // ── Role input (same fields as your CreateRoleDialog) ──
        roleInput: {
          role_id: "",
          role_name: "",
          status: "ACTIVE",
        },

        // ── Validation rules (same as your dialogs) ──
        rules: {
          required: (v) => !!v || "This field is required",
          email: (v) => !v || /.+@.+\..+/.test(v) || "Email must be valid",
          password: (v) => v.length >= 8 || "Password must be at least 8 characters",
        },

        // ── Snackbar ──
        snackbarComponent: {
          snackBarModel: false,
          color: "",
          message: "",
        },
      };
    },

    methods: {
      // ─────────────────────────
      // SNACKBAR HELPER
      // ─────────────────────────
      showSnackbar(color, message) {
          this.snackbarComponent.snackBarModel = true;
          this.snackbarComponent.color = color;
          this.snackbarComponent.message = message;
      setTimeout(()=>{
        this.snackbarComponent.snackBarModel=false
      })
      },

      // ─────────────────────────
      // ORGANIZATION
      // ─────────────────────────
      closeOrgDialog() {
        this.orgDialog = false;
        this.orgInput = {
          org_name: "", org_type: "", org_email: "",
          org_owner_name: "", org_owner_email: "",
          org_owner_password: "", address: "",
        };
        this.$refs.orgForm?.resetValidation();
      },

      async submitOrganization() {
        const { valid } = await this.$refs.orgForm.validate();
        if (!valid) return;
        await this.createOrganizationAPI();
      },

      async createOrganizationAPI() {
        this.orgLoading = true;
        
        try {
          const rawPayload = {
        command:            "createOrganisation",
        user_id:this.$store.getters.currentUser.user_id,
        org_name:           this.orgInput.org_name,
        org_email:          this.orgInput.org_email,
        org_owner_name:     this.orgInput.org_owner_name,
        org_owner_email:    this.orgInput.org_owner_email,
        org_owner_password: this.orgInput.org_owner_password,
        address:            this.orgInput.address,
      };

      // ✅ Only add org_type if it's not empty
      if (this.orgInput.org_type) {
        rawPayload.org_type = this.orgInput.org_type;
      }
          // ✅ REPLACE WITH YOUR REST API URL
          const response = await fetch("https://dd3n32fq95.execute-api.ap-south-1.amazonaws.com/test/organisations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rawPayload)
          });

          const result = await response.json();

          // ✅ REPLACE "SUCCESS" WITH YOUR API'S ACTUAL SUCCESS STATUS
          if (result?.status === "SUCCESS") {
            this.showSnackbar("success", result?.status_message || "Organization created successfully");
            this.closeOrgDialog();
          } else {
            this.showSnackbar("error", result?.status_message || "Something went wrong");
          }
        } catch (error) {
          this.showSnackbar("error", error?.message || "Something went wrong");
        } finally {
          this.orgLoading = false;
        }
      },

      // ─────────────────────────
      // ROLE
      // ─────────────────────────
      closeRoleDialog() {
        this.roleDialog = false;
        this.roleInput = { role_id: "", role_name: "", status: "ACTIVE" };
        this.$refs.roleForm?.resetValidation();
      },

      async submitRole() {
        const { valid } = await this.$refs.roleForm.validate();
        if (!valid) return;
        await this.createRoleAPI();
      },

      async createRoleAPI() {
        this.roleLoading = true;
        try {
          // ✅ REPLACE WITH YOUR REST API URL
          const response = await fetch("https://dd3n32fq95.execute-api.ap-south-1.amazonaws.com/test/roles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              role_id:   this.roleInput.role_id,
              role_name: this.roleInput.role_name,
              status:    this.roleInput.status,
            }),
          });

          const result = await response.json();

          // ✅ REPLACE "SUCCESS" WITH YOUR API'S ACTUAL SUCCESS STATUS
          if (result?.status === "SUCCESS") {
            this.showSnackbar("success", result?.status_message || "Role created successfully");
            this.closeRoleDialog();
          } else {
            this.showSnackbar("error", result?.status_message || "Something went wrong");
          }
        } catch (error) {
          this.showSnackbar("error", error?.message || "Something went wrong");
        } finally {
          this.roleLoading = false;
        }
      },
    },

    computed: {
      mdAndUp() {
        return this.$vuetify.display.mdAndUp;
      },
    },
  };
  </script>

  <style scoped>
  .subtitle {
    font-size: 13px;
    opacity: 0.7;
    margin: 0;
  }
  .action-card {
    cursor: pointer;
    transition: box-shadow 0.2s;
  }
  .action-card:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
  }
  </style>
