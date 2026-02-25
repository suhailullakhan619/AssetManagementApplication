<template>
  <OverlayComp :overlay="overlay"></OverlayComp>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-toolbar>
          <v-layout row wrap class="align-center ga-2">
            <v-icon color="primary" :size="mdAndUp ? 55 : 35"
              >mdi-account-group-outline</v-icon
            >
            <v-layout class="flex-column">
              <v-toolbar-title class="d-flex align-center">
                Roles List
                <v-icon
                  size="24"
                  class="cursor-pointer"
                  color="primary"
                  @click="refreshGetRoles"
                  >mdi-refresh</v-icon
                ></v-toolbar-title
              >
              <p class="subtitle">View List of Roles</p>
            </v-layout>
          </v-layout>
        </v-toolbar>
      </v-col>
      <v-col cols="12">
        <v-card elevation="2">
          <v-data-table
            density="comfortable"
            :headers="headers"
            :items="roles"
            fixed-header
            :height="Math.max(tableHeight, 200)"
          >
            <template v-slot:[`item.role_id`]="{ item }">
              <v-list class="usertablelist">
                <v-list-item :title="item.role_id">
                  <template v-slot:prepend>
                    <v-avatar color="profileBackground">
                      {{ item.role_id.slice(0, 2).toUpperCase() }}
                    </v-avatar>
                  </template>
                </v-list-item>
              </v-list>
            </template>
            <template v-slot:[`item.role_name`]="{ item }">
              <v-card-actions>
                <div class="fontVarient3">{{ item.role_name }}</div>
              </v-card-actions>
            </template>

            <template v-slot:[`item.role_status`]="{ item }">
              <v-chip
                :color="item.role_status === 'ACTIVE' ? 'success' : 'error'"
                density="compact"
                >{{ item.role_status }}</v-chip
              >
            </template>
            <template v-slot:[`item.created_on`]="{ item }">
              <div>{{ formatDate(item.created_on) }}</div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import OverlayComp from "@/components/Extras/OverlayComp.vue";
import { getRoles } from "@/mixins/RoleManagement/GetRoles";
import { formatDate } from "@/utils/DateFormater";
export default {
  components: {
    OverlayComp,
  },
  data() {
    return {
      headers: [
        { title: "Role ID", key: "role_id" },
        { title: "Role Name", key: "role_name" },
        { title: "Role Status", key: "role_status" },
        { title: "Created On", key: "created_on" },
      ],
      tableHeight: 0,
    };
  },
  mixins: [getRoles],
  methods: {
    formatDate,
    refreshGetRoles() {
      this.getRolesMethod();
    },
  },
  async mounted() {
    await this.getRolesMethod();
    this.tableHeight = window.innerHeight - 270;
  },
  computed: {
    mdAndUp() {
      return this.$vuetify.display.mdAndUp;
    },
  },
  watch: {
    "$vuetify.display.height"(val) {
      this.tableHeight = val - 280;
    },
  },
};
</script>

<style scoped>
.usertablelist.v-list {
  padding: 0;
}
</style>
