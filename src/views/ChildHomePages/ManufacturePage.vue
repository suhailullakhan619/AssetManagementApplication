<template>
  <v-container fluid class="pa-6">
    <OverlayComp :overlay="overlay" />
    <!-- HEADER -->
    <v-toolbar flat class="mb-4">
      <v-layout row wrap class="align-center ga-3">
        <v-icon color="primary" :size="mdAndUp ? 55 : 35">
          mdi-office-building-outline
        </v-icon>

        <v-layout class="flex-column">
          <v-toolbar-title class="font-weight-bold">
            Manufacturer Management
            <v-icon
              size="22"
              class="cursor-pointer ml-2"
              color="primary"
              @click="refreshManufacturers"
            >
              mdi-refresh
            </v-icon>
          </v-toolbar-title>
          <span class="subtitle">
            Create and manage manufacturers
          </span>
        </v-layout>
      </v-layout>

      <v-spacer />

      <!-- ADD BUTTON -->
        <v-btn
        color="primary"
        variant="flat"
        rounded="circle"
        class="d-flex d-sm-none"
        icon
        @click="openCreateManufacturerDialog"
      >
        <v-icon >mdi-plus</v-icon>
      </v-btn>
      <v-btn
        color="primary"
        variant="flat"
        rounded="lg"
        class="d-none d-sm-flex"
        @click="openCreateManufacturerDialog"
      >
        <v-icon start>mdi-plus</v-icon>
        Add Manufacturer
      </v-btn>
    </v-toolbar>

    <!-- TABLE -->
    <v-card elevation="2" rounded="lg">
      <v-card-text class="pa-2 d-flex justify-end">
                    <v-col cols="12"  sm="3" md="3" lg="3" xl="3" class="pa-0">

          <v-text-field
            v-model="search"
            label="Search Manufacturer"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-magnify"
            hide-details
          />
        </v-col>
      </v-card-text>

      <v-divider />

      <v-data-table
        :headers="headers"
        :items="manufactureListArray"
        :search="search"
        density="comfortable"
        fixed-header
        :height="tableHeight"
      >
        <!-- STATUS -->
        <template v-slot:[`item.manufacturer_status`]="{ item }">
          <v-chip
            density="comfortable"
            :color="item.manufacturer_status === 'ACTIVE' ? 'green' : 'red'"
          >
            {{ item.manufacturer_status }}
          </v-chip>
        </template>

        <template v-slot:[`item.created_on`]="{ item }">
          <div
          >
            {{dateMStoddmmyyyy(item.created_on) }}
          </div>
        </template>

        <!-- ACTIONS -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-menu location="bottom end">
            <template #activator="{ props }">
              <v-btn
                icon
                variant="text"
                v-bind="props"
                rounded="circle"
                size="32"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="openUpdateManufacturerDialog(item)">
                <template #prepend>
                  <v-icon color="success">mdi-pencil</v-icon>
                </template>
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>

              <v-list-item @click="openDeleteManufacturerDialog(item)">
                <template #prepend>
                  <v-icon color="error">mdi-delete</v-icon>
                </template>
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>

    <!-- DIALOGS -->
    <CreateManufactureDialog
      v-model="createDialog"
      @success="refreshManufacturers"
    />

    <UpdateManufactureDialog
      v-model="updateDialog"
      :manufacturer="selectedManufacturer"
      @success="refreshManufacturers"
    />

    <DeleteManufactureDialog
      v-model="deleteDialog"
      :manufacturer="selectedManufacturer"
      @success="refreshManufacturers"
    />
  </v-container>
</template>


<script>
import OverlayComp from '@/components/Extras/OverlayComp.vue'
import { ManufactureList } from '@/mixins/manufacture/ManufactureList';
import CreateManufactureDialog from '@/components/ManufacturePageComponents/Dialogs/CreateManufactureDialog.vue';
import UpdateManufactureDialog from '@/components/ManufacturePageComponents/Dialogs/UpdateManufactureDialog.vue';
import DeleteManufactureDialog from '@/components/ManufacturePageComponents/Dialogs/DeleteManufactureDialog.vue';
import { dateMStoddmmyyyy } from '@/utils/DateMStoddmmyyy';
export default {
  components: {
    OverlayComp,
    CreateManufactureDialog,
    UpdateManufactureDialog,
    DeleteManufactureDialog
  },
   mounted() {
    this.tableHeight = window.innerHeight - 350
    this.refreshManufacturers()
  },
   computed: {
    mdAndUp() {
      return this.$vuetify.display.mdAndUp
    }
  },
  watch:{
  "$vuetify.display.height"(val) {
      this.tableHeight = val - 280;
    },
  },
mixins:[ManufactureList],
  data() {
    return {
      overlay: false,
      search: '',
      tableHeight: 0,
      createDialog: false,
      updateDialog: false,
      deleteDialog: false,
      selectedManufacturer: {},
      headers: [
        { title: 'Manufacturer Name', key: 'manufacturer_name' },
        { title: 'Contact Person', key: 'manufacturer_contact_person' },
        { title: 'Email Id', key: 'manufacturer_email_id' },
        { title: 'Created On', key: 'created_on' },
        { title: 'Status', key: 'manufacturer_status' },
        { title: 'Actions', key: 'actions' }
      ]
    }
  },

  methods: {
    dateMStoddmmyyyy,
    openCreateManufacturerDialog() {
      this.createDialog = true
    },

    openUpdateManufacturerDialog(item) {
      this.selectedManufacturer = item
      this.updateDialog = true
    },

    openDeleteManufacturerDialog(item) {
      this.selectedManufacturer = item
      this.deleteDialog = true
    },

    async refreshManufacturers() {
      this.overlay = true
      // 👉 call list manufacturers API here
    await this.manufactureListMethod()
      this.overlay = false
    }
  }
}
</script>
