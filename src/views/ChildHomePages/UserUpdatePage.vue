<template>
  <v-container>
    <!-- USER PROFILE CARD -->
    <v-card rounded="lg" class="pa-5">
      <v-row align="center">
        <v-avatar size="64" color="primary">
          {{ user.user_name?.slice(0, 2).toUpperCase() }}
        </v-avatar>

        <v-col>
          <h3>{{ user.user_name }}</h3>
          <p class="text-grey">{{ user.user_email_id }}</p>
          <v-chip
            :color="user.user_status === 'ACTIVE' ? 'success' : 'error'"
            density="compact"
          >
            {{ user.user_status }}
          </v-chip>
        </v-col>

        <v-btn icon color="primary" @click="openUpdateDialog">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </v-row>

      <v-divider class="my-4" />

      <p><strong>Address:</strong> {{ user.address }}</p>
    </v-card>

    <!-- UPDATE DIALOG -->
    <CreateEditUserDialog
      :CreateEditUserDialog="dialogOpen"
      :StoreObj="storeObj"
      @clicked="onDialogResult"
    />
  </v-container>
</template>

<script>
import CreateEditUserDialog from "@/components/UserPageComponents/Dialogs/CreateEditUserDialog.vue";
import { UserMutations } from "@/mixins/UserManagement/CreateUpdateUser";
import { getCurrentUser } from "@/mixins/GetCurrentUser/getCurrentUser";
export default {
  props: {
    SnackbarComp: Object,
  },
  components: { CreateEditUserDialog },

  data() {
    return {
      dialogOpen: false,
      storeObj: {},
    };
  },
  mixins: [UserMutations, getCurrentUser],
  methods: {
    openUpdateDialog() {
      this.storeObj = { ...this.user, action: "UPDATE" };
      this.dialogOpen = true;
    },

    async onDialogResult(result) {
      this.dialogOpen = false;

      // ❌ user clicked cancel
      if (result !== 2) return;

      // ✅ refetch updated user
      await this.getCurrentUserMethod();
    },
  },
  computed: {
    user() {
      return this.$store.getters.currentUser || {};
    },
  },
};
</script>
