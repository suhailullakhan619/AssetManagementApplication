<template>
  <v-container fluid>
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

      <!-- ACTIONS -->
      <v-row class="pt-5">
        <!-- ADD ORGANIZATION -->
        <v-col cols="12" md="6">
          <v-tooltip location="top" text="Create a new organization">
            <template #activator="{ props }">
              <v-card
                v-bind="props"
                class="pa-5 action-card"
                elevation="2"
                @click="openAddOrganization"
              >
                <v-icon size="36" color="primary"> mdi-domain </v-icon>

                <h3 class="mt-3">Add Organization</h3>
                <p class="text-grey">
                  Register a new organization in the system
                </p>
              </v-card>
            </template>
          </v-tooltip>
        </v-col>

        <!-- CREATE ROLE -->
        <v-col cols="12" md="6">
          <v-tooltip location="top" text="Create a new role">
            <template #activator="{ props }">
              <v-card
                v-bind="props"
                class="pa-5 action-card"
                elevation="2"
                @click="openRoleDialog"
              >
                <v-icon size="36" color="primary"> mdi-account-key </v-icon>

                <h3 class="mt-3">Create Role</h3>
                <p class="text-grey">Define new roles and permissions</p>
              </v-card>
            </template>
          </v-tooltip>
        </v-col>
      </v-row>

    <!-- ROLE DIALOG -->
    <CreateRoleDialog v-model="roleDialog" />
    <!-- org dialog -->
    <CreateOrgnizationDialog v-model="orgDialog" />
  </v-container>
</template>

<script>
import CreateOrgnizationDialog from "@/components/AdminPageComponents/Dialogs/CreateOrgnizationDialog.vue";
import CreateRoleDialog from "@/components/AdminPageComponents/Dialogs/CreateRoleDialog.vue";

export default {
  props: {},
  components: {
    CreateRoleDialog,
    CreateOrgnizationDialog,
  },
  data() {
    return {
      orgDialog: false,
      roleDialog: false,
    };
  },
  methods: {
    openAddOrganization() {
      this.orgDialog = true;
    },
    openRoleDialog() {
      this.roleDialog = true;
    },
  },
  computed: {
    mdAndUp() {
      return this.$vuetify.display.mdAndUp;
    },
  },
};
</script>

<style scoped></style>
