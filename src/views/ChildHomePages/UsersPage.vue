<template>
  <div>
    <SnackbarComp :snackbarComponent="snackbarComponent" />
    <OverlayComp :overlay="overlay"></OverlayComp>
    <CreateEditUserDialog
      :CreateEditUserDialog="CreateEditUserDialog"
      :StoreObj="StoreObj"
      @clicked="CreateEditUserDialogEmit"
    />
    <UserStatusUpdateDialog
      v-model="statusDialog"
      :user="selectedUserForStatus"
      @success="onStatusUpdateSuccess"
      @error="onStatusUpdateError"
    />
    <DeleteUserDialog v-model="deleteDialog" :user="StoreObj" @confirm="confirmDelete" />

    <v-container fluid>
      <v-row>
        <v-col
          v-for="(item, index) in logesticsCardList"
          :key="index"
          cols="12"
          sm="6"
          md="3"
          class="d-flex flex-row"
        >
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              class="w-100"
              style="border-radius: 10px; padding-bottom: 2px"
              :color="isHovering ? item.iconcolor : item.iconbackground"
            >
              <v-card variant="flat" rounded="lg" v-bind="props" class="w-100">
                <v-container fluid>
                  <v-layout row class="mb-2 align-center">
                    <v-avatar
                      size="40"
                      :color="item.iconbackground"
                      style="border-radius: 6px"
                      class="mr-3"
                    >
                      <v-icon size="24" :color="item.iconcolor">{{
                        item.icon
                      }}</v-icon>
                    </v-avatar>
                    <h2 class="font-weight-medium">{{ item.heading }}</h2>
                  </v-layout>

                  <p class="text-primary">{{ item.about }}</p>

                  <p style="color: #676a7b" class="font-weight-medium">
                    {{ item.percentage }}%<span
                      class="ml-2 font-weight-regular"
                      style="color: #a8aab4; font-size: 13px"
                      >{{ item.percentagespan }}</span
                    >
                  </p>
                </v-container>
              </v-card>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-5">
        <v-col cols="12">
          <v-toolbar class="m">
            <v-layout row wrap class="align-center">
              <v-icon color="primary" :size="mdAndUp ? 55 : 35"
                >mdi-account-outline</v-icon
              >

              <v-layout class="flex-column">
                <v-toolbar-title class="d-flex align-center"
                  >User Management
                  <v-icon
                    size="24"
                    class="cursor-pointer"
                    @click="refetchUserFromapi"
                    color="primary"
                    >mdi-refresh</v-icon
                  ></v-toolbar-title
                >
                <p class="subtitle">Add and update Users</p>
              </v-layout>
            </v-layout>

            <v-spacer />

            <v-btn
              color="primary"
              variant="flat"
              rounded="lg"
              @click="openDialogMethod('CREATE')"
              class="fontVariant4"
              v-if="mdAndUp"
            >
              <v-icon>mdi-plus</v-icon> Add New User
            </v-btn>
            <v-tooltip v-else text="Add New User">
              <template #activator="{ props }">
                <v-btn
                  icon
                  color="primary"
                  v-bind="props"
                  variant="flat"
                  rounded="circle"
                  @click="openDialogMethod('CREATE')"
                  class="fontVariant4"
                  ><v-icon>mdi-plus</v-icon></v-btn
                >
              </template>
            </v-tooltip>
          </v-toolbar>
        </v-col>
        <v-col cols="12">
          <v-card elevation="2" rounded="lg" class="mt-5">
            <v-card-title
              class="d-flex flex-column align-center flex-sm-row ga-3"
            >
              <v-spacer></v-spacer>
            <v-col cols="12"  sm="3" md="3" lg="3" xl="3" class="pa-0">
                <v-select
                  density="comfortable"
                  hide-details="auto"
                  v-model="selectedStatus"
                  label="User Status"
                  :items="filterbyActiveInactive"
                  item-title="title"
                  item-value="value"
                  variant="outlined"
                ></v-select>
            </v-col>

              <!-- <v-menu
      transition="slide-y-transition"
      v-model="chevronmenuOpen"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          color="primary"
          v-bind="props"
          variant="outlined" 
          class="d-flex align-center"
        >
         {{ selectedStatus === "ACTIVE"
          ? "Active Users"
          : "Inactive Users" }}
          <v-icon size="28">{{chevronmenuOpen?'mdi-chevron-up':'mdi-chevron-down'}}</v-icon>
        </v-btn>
      </template>
      <v-list >
        <v-list-item
          v-for="(item, i) in filterbyActiveInactive"
          :key="item.value"
          :value="i"
          @click="applyStatusFilter(item.value)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
              </v-menu> -->
            <v-col cols="12" sm="3" md="3" lg="3" xl="3" class="pa-0"> 
                 <v-text-field
            v-model="search"
            label="Search User"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-magnify"
            hide-details
          />
                </v-col>
            </v-card-title>
            <v-divider></v-divider>

            <v-data-table
              density="comfortable"
              :headers="tableHeaders"
              :items="getlistUsersNewArray"
              fixed-header
              :height="Math.max(tableHeight, 200)"
              v-model:search="search"
            >
              <template v-slot:[`item.user_name`]="{ item }">
                <v-list class="usertablelist">
                  <v-list-item
                    :subtitle="item.user_email_id"
                    :title="item.user_name"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="profileBackground">
                        {{ item.user_name.slice(0, 2).toUpperCase() }}
                      </v-avatar>
                    </template>
                  </v-list-item>
                </v-list>
              </template>
              <template v-slot:[`item.user_email_id`]="{ item }">
                <v-card-actions>
                  <v-icon color="primary" size="28">mdi-email-outline</v-icon>
                  <div class="fontVarient3">{{ item.user_email_id }}</div>
                </v-card-actions>
              </template>

              <template v-slot:[`item.user_status`]="{ item }">
                <v-chip
                  :color="item.user_status === 'ACTIVE' ? 'success' : 'error'"
                  density="compact"
                  >{{ item.user_status }}</v-chip
                >
                <!-- <v-btn
                  v-if="currentUser && currentUser.role_id === 'ORG_OWNER'"
                  @click="openStatusDialog(item)"
                  color="transparent"
                  icon=""
                  rounded="circle"
                  size="30"
                  elevation="0"
                  class="ml-2"
                >
                  <v-icon color="green">mdi-pencil</v-icon>
                </v-btn> -->
              </template>
              <template v-slot:[`item.address`]="{ item }">
                <v-list class="usertablelist">
                  <v-list-item :title="item.address"> </v-list-item>
                </v-list>
              </template>
              <template v-slot:[`item.created_on`]="{ item }">
                <div>{{ formatDate(item.created_on) }}</div>
              </template>

              <template v-slot:[`item.actions`]="{ item }">
                <v-card-actions>
                  <!-- <v-btn color="transparent" icon="" size="30" elevation="0">
                    <v-icon
                      color="green"
                      @click="openDialogMethod('UPDATE', item)"
                      >mdi-pencil</v-icon
                    >
                  </v-btn> -->
                  <v-menu rounded="lg" location="bottom end">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        color="transparent"
                        icon=""
                        size="35"
                        elevation="0"
                        v-bind="props"
                      >
                        <v-icon color="primary">mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item @click="openDialogMethod('UPDATE', item)">
                        <template v-slot:prepend>
                          <v-icon color="green">mdi-pencil</v-icon>
                        </template>
                        <v-list-item-title>Update</v-list-item-title>
                      </v-list-item>

                      <v-list-item @click="openStatusDialog(item)">
                        <template v-slot:prepend>
                          <v-icon
                            :color="
                              item.user_status === 'ACTIVE'
                                ? 'error'
                                : 'success'
                            "
                          >
                            {{
                              item.user_status === "ACTIVE"
                                ? "mdi-account-off"
                                : "mdi-account-check"
                            }}
                          </v-icon>
                        </template>
                        <v-list-item-title>
                          {{
                            item.user_status === "ACTIVE"
                              ? "Deactivate"
                              : "Activate"
                          }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="openDeleteDialog(item)">
                        <template #prepend>
                          <v-icon color="error">mdi-delete</v-icon>
                        </template>
                        <v-list-item-title >
                          Delete
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-card-actions>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import OverlayComp from "@/components/Extras/OverlayComp.vue";
import SnackbarComp from "@/components/Extras/SnackbarComp.vue";
import CreateEditUserDialog from "@/components/UserPageComponents/Dialogs/CreateEditUserDialog.vue";
import DeleteUserDialog from "@/components/UserPageComponents/Dialogs/DeleteUserDialog.vue";
import UserStatusUpdateDialog from "@/components/UserPageComponents/Dialogs/UserStatusUpdateDialog.vue";
import { getlistUsersNew } from "@/mixins/UserManagement/getlistUsersNew";
import { formatDate } from "@/utils/DateFormater.js";
export default {
  props: {
    SnackbarComp: Object,
  },
  components: {
    OverlayComp,
    CreateEditUserDialog,
    UserStatusUpdateDialog,
    SnackbarComp,
    DeleteUserDialog,
  },
  mixins: [getlistUsersNew],
  data() {
    return {
      selectedUserForStatus: null,
      overlay: false,
      CreateEditUserDialog: false,
      statusDialog: false,
      deleteDialog: false,
      chevronmenuOpen: false,
      tableHeight: 0,
      search: "",
      selectedStatus: "ACTIVE",
      StoreObj: {},
      snackbarComponent: {
        snackBarModel: false,
        color: "",
        message: "",
      },
      filterbyActiveInactive: [
        { title: "Active Users", value: "ACTIVE" },
        { title: "Inactive Users", value: "INACTIVE" },
      ],
      tableHeaders: [
        { title: "Name", key: "user_name" },
        { title: "Email Id", key: "user_email_id" },
        { title: "Status", key: "user_status" },
        { title: "Address", key: "address" },
        { title: "Created on", key: "created_on" },
        { title: "Actions", key: "actions" },
      ],
      getlistUsersNewArray: [],
      logesticsCardList: [
        {
          icon: "mdi-car-outline",
          iconcolor: "#666cff",
          iconbackground: "#e7e7ff",
          heading: "42",
          about: "On route vehicles",
          percentage: "+18.2",
          percentagespan: "than last week",
        },
        {
          icon: "mdi-alert-outline",
          iconcolor: "orange",
          iconbackground: "#fff3dd",
          heading: "8",
          about: "Vehicles with errors",
          percentage: "-8.7",
          percentagespan: "than last week",
        },
        {
          icon: "mdi-map-marker-distance",
          iconcolor: "red",
          iconbackground: "#ffe3e2",
          heading: "27",
          about: "Deviated from route",
          percentage: "+4.3",
          percentagespan: "than last week",
        },
        {
          icon: "mdi-clock-outline",
          iconcolor: "blue",
          iconbackground: "#dcf6fe",
          heading: "13",
          about: "Late vehicles",
          percentage: "-2.5",
          percentagespan: "than last week",
        },
      ],
    };
  },
  async mounted() {
    this.tableHeight = window.innerHeight - 475;
  },

  methods: {
    formatDate,
    showSnackBar(color, message) {
      this.snackbarComponent = {
        snackBarModel: true,
        color: color,
        message: message,
      };
      setTimeout(() => {
        this.snackbarComponent.snackBarModel = false;
      }, 1000);
    },
    openDialogMethod(action, item) {
      if (action === "CREATE") {
        this.StoreObj = { action: "CREATE" };

        this.CreateEditUserDialog = true;
      } else if (action === "UPDATE") {
        this.StoreObj = {
          ...item,
          action: "UPDATE",
          editRole: this.currentUser.role_id,
        };
        this.CreateEditUserDialog = true;
      } else if (action === "DELETE") {
        this.StoreObj = item;
        this.StoreObj.action = action;
      }
    },
    async CreateEditUserDialogEmit(Toggle) {
      this.CreateEditUserDialog = false;
      if (Toggle === 2) {
        await this.getlistUsersNewMethod(this.selectedStatus);
        this.StoreObj = {};
      }
    },
    async refetchUserFromapi() {
      await this.getlistUsersNewMethod(this.selectedStatus);
    },

    openStatusDialog(user) {
      this.selectedUserForStatus = {
        user_id: user.user_id,
        user_status: user.user_status,
      };
      this.statusDialog = true;
    },

    async onStatusUpdateSuccess() {
      this.statusDialog = false;
      this.selectedUserForStatus = null;
      await this.getlistUsersNewMethod(this.selectedStatus);
      this.showSnackBar("success", "User status updated successfully");
    },

    onStatusUpdateError(error) {
      console.error(error);
      this.showSnackBar(
        "error",
        error.status_message || "Failed to update user status",
      );
    },
    async applyStatusFilter(status) {
      this.selectedStatus = status;

      // If API supports filter
      await this.getlistUsersNewMethod(status);
      // this.chevronArrowBtn = false;
      // Optional UX feedback
      this.showSnackBar("info", `Showing ${status.toLowerCase()} users`);
    },
    openDeleteDialog(item) {
      this.StoreObj = item;
      this.deleteDialog = true;
    },
    async confirmDelete(user) {
      try {
        // 🔁 call delete API here
        await this.deleteUserMethod(user.user_id);

        await this.getlistUsersNewMethod(this.selectedStatus);
        this.showSnackBar("success", "User deleted successfully");
      } catch (e) {
        this.showSnackBar("error", e.status_message || "Failed to delete user");
      }
    },
  },

  watch: {
    "$vuetify.display.height"(val) {
      this.tableHeight = val - 280;
    },
    selectedStatus: {
      immediate: true,
      async handler(val) {
        await this.applyStatusFilter(val);
      },
    },
  },

  computed: {
    mdAndUp() {
      return this.$vuetify.display.mdAndUp;
    },
    currentUser() {
      return this.$store.getters.currentUser;
    },
  },
};
</script>

<style scoped>
.usertablelist.v-list {
  padding: 0;
}

.subtitle {
  width: fit-content;
  margin: 0;
  font-size: 13px;
  opacity: 0.7;
}
</style>
