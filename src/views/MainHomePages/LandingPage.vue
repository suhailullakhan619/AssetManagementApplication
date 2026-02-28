<template>
  <!-- SIDEBAR -->

  <div v-if="getCurrentUserDetails && Object.keys(getCurrentUserDetails).length > 0 ">

    <SnackbarComp :snackbarComponent="snackbarComponent" />
    <v-navigation-drawer app v-model="drawer" :permanent="mdAndUp" :temporary="!mdAndUp"
      :width="mdAndUp ? (rail ? 55 : 256) : 256" @mouseenter="rail = false" @mouseleave="rail = true">
      <v-list>
        <v-list-item  class="navigationheader" density="compact">
          <template #prepend>
            <v-avatar size="32">
              <v-img src="@/assets/assetLogo.svg" alt="Logo" />
            </v-avatar>
          </template>
          <v-list-item-title  class="navigationheader" >AssetDesk</v-list-item-title>
          <template #append>
            <v-btn :icon="mdAndUp
              ? rail
                ? 'mdi-chevron-double-right'
                : 'mdi-chevron-double-left'
              : 'mdi-close'
              " variant="text" rounded="circle" aria-label="Toggle navigation" @click.stop="toggleRail" />
          </template>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-list density="compact" nav v-if="getCurrentUserDetails">
        <!-- OTHER NAV ITEMS -->
        <template v-if="getCurrentUserDetails && getCurrentUserDetails.role_id === 'SUPER_ADMIN'">
          <v-list-item v-for="(item, index) in AdminRouterList" :key="index" :title="item.title" :to="item.path"
            :prepend-icon="item.icon" class="navigationlistitem" active-class="nav-active"
            @click="onNavItemClick" /></template>

        <template v-if="getCurrentUserDetails && getCurrentUserDetails.role_id === 'ORG_OWNER'">
          <v-list-item v-for="(item, index) in OrgnizationRouterList" :key="index" :title="item.title" :to="item.path"
            :prepend-icon="item.icon" class="navigationlistitem" active-class="nav-active"
            @click="onNavItemClick" /></template>
        <template v-if="getCurrentUserDetails && getCurrentUserDetails.role_id === 'ORG_USER'">
          <v-list-item v-for="(item, index) in UserProfileUpdateList" :key="index" :title="item.title" :to="item.path"
            :prepend-icon="item.icon" class="navigationlistitem" active-class="nav-active" 
            @click="onNavItemClick" /></template>
        <v-divider class="my-5"></v-divider>
        <v-list>
          <v-list-item title="Rest API" class="pa-1" density="compact">
            <template #prepend>
              <v-avatar size="35">
                <v-img src="@/assets/restapilogo (2).svg" alt="Logo" />
              </v-avatar>
            </template>
          </v-list-item>
        </v-list>
        <!-- OTHER NAV ITEMS -->
        <template v-if="getCurrentUserDetails && getCurrentUserDetails.role_id === 'SUPER_ADMIN'">
          <v-list-item v-for="(item, index) in AdminRouterRestapiList" :key="index" :title="item.title" :to="item.path"
            :prepend-icon="item.icon" class="navigationlistitem" active-class="nav-active"
            @click="onNavItemClick" /></template>

        <template v-if="getCurrentUserDetails && getCurrentUserDetails.role_id === 'ORG_OWNER'">
          <v-list-item v-for="(item, index) in OrgnizationRouterListRestapiList" :key="index" :title="item.title"
            :to="item.path" :prepend-icon="item.icon" class="navigationlistitem" active-class="nav-active"
            @click="onNavItemClick" /></template>
        <template v-if="getCurrentUserDetails && getCurrentUserDetails.role_id === 'ORG_USER'">
          <v-list-item v-for="(item, index) in UserProfileUpdateListRestapiList" :key="index" :title="item.title"
            :to="item.path" :prepend-icon="item.icon" class="navigationlistitem" active-class="nav-active"
            @click="onNavItemClick" /></template>
      </v-list>
    </v-navigation-drawer>

    <!-- APP BAR -->
    <v-app-bar app  elevation="0" class="fixed-app-header">
      <v-btn icon width="40" height="40" class="d-md-none ml-0" variant="text" color="transparent" @click="drawer = !drawer" >
        <v-icon color="black" size="30">mdi-menu</v-icon>
      </v-btn>
      <v-btn v-if="mdAndUp" class="align-center" elevation="0"   @click="openSearchDialog">Search
        <template #prepend>
     <v-icon >mdi-magnify</v-icon>
        </template>
        <span class="ml-2 border-sm pa-1 rounded-lg" style="color: gray;">CTRL+K</span>
      </v-btn>
      <v-icon v-else size="30"  @click="openSearchDialog">mdi-magnify</v-icon>
      <v-spacer />

      <ThemeDialog />
      <GlobalSearchDialog v-model:GlobalSearchDialogEmit="searchDialog" :role="getCurrentUserDetails.role_id"/>
      <v-avatar size="36" color="profileBackground">
        {{ getCurrentUserDetails?.role_id.slice(0, 2)||'' }}
      </v-avatar>

      <v-list density="compact" class="d-flex flex-row">
        <v-list-item  class="d-flex flex-column custom-v-list-1">
          <v-list-item-title>{{ getCurrentUserDetails?.role_id||'' }}</v-list-item-title>
          <v-list-item-subtitle>{{
            getCurrentUserDetails?.user_email_id||''
            }}</v-list-item-subtitle>
        </v-list-item>
        <v-btn width="40" height="40" icon rounded="circle" @click="showLogoutDialog = true">
          <v-icon size="32">mdi-logout</v-icon>
        </v-btn>
      </v-list>
    </v-app-bar>
    <logout-dialog v-model="showLogoutDialog" @confirm="logoutUser" />
    <!-- MAIN CONTENT -->

    <v-main app>
      <router-view />
    </v-main>

  </div>
    <OverlayComp :overlay="overlay"/>
</template>

<script>
import { signOut } from "aws-amplify/auth";
import RouterList from "@/JsonFiles/RouterList.json";
import AdminRouterList from "@/JsonFiles/AdminRouterList.json";
import OrgnizationRouterList from "@/JsonFiles/OrganisationRouterList.json";
import LogoutDialog from "@/components/LogoutDialogbox/LogoutDialog.vue";
import ThemeDialog from "@/components/Extras/ThemeDialog.vue";
import GlobalSearchDialog from "@/components/Extras/GlobalSearchDialog.vue";
import SnackbarComp from "@/components/Extras/SnackbarComp.vue";
import UserProfileUpdateList from "@/JsonFiles/UserProfileRouterList.json";
import AdminRouterRestapiList from "@/JsonFiles/AdminRouterListRestapi.json";
import OrgnizationRouterListRestapiList from "@/JsonFiles/OrganisationRouterListRestapi.json";
import UserProfileUpdateListRestapiList from "@/JsonFiles/UserProfileRouterListRestapi.json";
import { getCurrentUser } from "@/mixins/GetCurrentUser/getCurrentUser";
import OverlayComp from "@/components/Extras/OverlayComp.vue";
export default {
  name: "App",
  props: {
    snackbarComp: Object,
  },
  components: {
    LogoutDialog,
    ThemeDialog,
    SnackbarComp,
    OverlayComp,
    GlobalSearchDialog
  },
  mixins: [getCurrentUser],
  data() {
    return {
      overlay:false,
      drawer: false,
      rail: true,
      showLogoutDialog: false,
       searchDialog: false,
      Email: "",
      name: "",
      snackbarComponent: {
        snackBarModel: false,
        color: "",
        message: "",
      },
      RouterList,
      AdminRouterList,
      OrgnizationRouterList,
      UserProfileUpdateList,
      AdminRouterRestapiList,
      OrgnizationRouterListRestapiList,
      UserProfileUpdateListRestapiList,
      getCurrentUserDetails: {},
    };
  },
  computed: {
    mdAndUp() {
      return this.$vuetify.display.mdAndUp;
    },
  },
  async mounted() {
    if (this.mdAndUp) {
      this.drawer = true;
      this.rail = true;
    }
  // ⌨️ Register Ctrl + K
  window.addEventListener('keydown', this.handleGlobalShortcut)
    this.overlay=true;
    await this.getCurrentUserMethod();
    if (this?.getCurrentUserDetails.role_id==='SUPER_ADMIN') {
      this.$router.push("/Admin")
    } else if(this?.getCurrentUserDetails.role_id==='ORG_OWNER'){
      this.$router.push('/Users')
    } else if(this?.getCurrentUserDetails.role_id==='ORG_USER'){
      this.$router.push('/UserProfile')
    } else {
      this.$router.push("/")
    }
 this.overlay=false

  },
  beforeUnmount() {
  window.removeEventListener('keydown', this.handleGlobalShortcut)
},
  methods: {
     openSearchDialog() {
    this.searchDialog = true
  },
   handleGlobalShortcut(e) {
    // Ctrl + K (Windows/Linux) OR Cmd + K (Mac)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault() // prevent browser search
      this.openSearchDialog()
    }
  },
    async logoutUser() {
      this.snackbarComponent = {
        snackBarModel: true,
        color: "success",
        message: "Logout Successfully...",
      };

      setTimeout(async () => {
        await signOut({ global: true });
        localStorage.clear();
        sessionStorage.clear();
      }, 100);

      setTimeout(() => {
        this.$store.dispatch("clearCurrentUser");
        this.$router.push("/");
      }, 1500);
    },
    toggleRail() {
      // 📱 Mobile / Tablet UX
      if (!this.mdAndUp) {
        this.drawer = false; // close drawer
        this.dashboardOpen = false;
        return;
      }

      // 🖥 Desktop UX
      this.rail = !this.rail; // toggle compact mode
      this.drawer = true; // always keep drawer visible
      this.dashboardOpen = false; // avoid awkward open groups
    },
    onNavItemClick() {
      if (!this.mdAndUp) {
        this.drawer = false;
      }
      this.rail = true;
    },
  },
};
</script>

<style >
.v-overlay {
  z-index: 3000 !important;
}
.fixed-app-header{
  min-height: 68px !important;
  max-height: 68px !important;
}
.navigationheader {
  padding: 0px;
}

/* Active list item background */
.nav-active {
  background-color: #03376b !important;
  color: white !important;
}

/* Icon color */
.nav-active .v-icon {
  color: white !important;
}

.custom-v-list-1 v-list-item--density-compact:not(.v-list-item--nav).v-list-item--one-line {
  padding: 2px 10px;
}

.navigationheader .v-list-item-title {
  font-size: 20px;
  letter-spacing: 0.009375em;
  line-height: 1.5;
  text-transform: none;
  font-weight: 600;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.v-toolbar__content {
  justify-content: flex-end;
  padding: 10px;
}

</style>
