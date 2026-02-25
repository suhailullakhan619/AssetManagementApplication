<template>
  <v-container fluid class="pa-6">
    <OverlayComp :overlay="overlay" />

    <!-- HEADER -->
    <v-toolbar flat class="mb-4">
      <v-layout row wrap class="align-center ga-3">
        <v-icon color="primary" :size="mdAndUp ? 55 : 35">
          mdi-truck-outline
        </v-icon>

        <v-layout class="flex-column">
          <v-toolbar-title class="font-weight-bold">
            Supplier Management
            <v-icon
              size="22"
              class="cursor-pointer ml-2"
              color="primary"
              @click="refreshSuppliers"
            >
              mdi-refresh
            </v-icon>
          </v-toolbar-title>
          <span class="subtitle">
            Create and manage suppliers
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
        @click="openCreateSupplierDialog"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <v-btn
        color="primary"
        variant="flat"
        rounded="lg"
        class="d-none d-sm-flex"
        @click="openCreateSupplierDialog"
      >
        <v-icon start>mdi-plus</v-icon>
        Add Supplier
      </v-btn>
    </v-toolbar>

    <!-- TABLE -->
    <v-card elevation="2" rounded="lg">
      <v-card-text class="pa-2 d-flex justify-end">
                    <v-col cols="12"  sm="3" md="3" lg="3" xl="3" class="pa-0">

          <v-text-field
            v-model="search"
            label="Search Supplier"
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
        :items="supplierListArray"
        :search="search"
        density="comfortable"
        fixed-header
        :height="tableHeight"
      >
        <!-- STATUS -->
        <template v-slot:[`item.supplier_status`]="{ item }">
          <v-chip
            density="comfortable"
            :color="item.supplier_status === 'ACTIVE' ? 'green' : 'red'"
          >
            {{ item.supplier_status }}
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
              <v-list-item @click="openUpdateSupplierDialog(item)">
                <template #prepend>
                  <v-icon color="success">mdi-pencil</v-icon>
                </template>
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>

              <v-list-item @click="openDeleteSupplierDialog(item)">
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
    <CreateSupplierDialog
      v-model="createDialog"
      @success="refreshSuppliers"
    />

    <UpdateSupplierDialog
      v-model="updateDialog"
      :supplier="selectedSupplier"
      @success="refreshSuppliers"
    />

    <DeleteSupplierDialog
      v-model="deleteDialog"
      :supplier="selectedSupplier"
      @success="refreshSuppliers"
    />
  </v-container>
</template>

<script>
import OverlayComp from '@/components/Extras/OverlayComp.vue'
import { supplierList } from '@/mixins/Supplier/SupplierList'
import CreateSupplierDialog from '@/components/SupplierComponents/Dialogs/CreateSupplierDialog.vue';
import UpdateSupplierDialog from '@/components/SupplierComponents/Dialogs/UpdateSupplierDialog.vue';
import DeleteSupplierDialog from '@/components/SupplierComponents/Dialogs/DeleteSupplierDialog.vue';
import { dateMStoddmmyyyy } from '@/utils/DateMStoddmmyyy';
export default {
  components: {
    OverlayComp,
    CreateSupplierDialog,
   UpdateSupplierDialog,
  DeleteSupplierDialog
  },

  mixins: [supplierList],

  mounted() {
    this.tableHeight = window.innerHeight - 350
    this.refreshSuppliers()
  },

  computed: {
    mdAndUp() {
      return this.$vuetify.display.mdAndUp
    }
  },

  watch: {
    '$vuetify.display.height'(val) {
      this.tableHeight = val - 280
    }
  },

  data() {
    return {
      overlay: false,
      search: '',
      tableHeight: 0,

      createDialog: false,
      updateDialog: false,
      deleteDialog: false,

      selectedSupplier: {},

      headers: [
        { title: 'Supplier Name', key: 'supplier_name' },
        { title: 'Supplier Number', key: 'supplier_number' },
        { title: 'Email Id', key: 'supplier_email' },
        { title: 'Status', key: 'supplier_status' },
        { title: 'Created On', key: 'created_on' },
        { title: 'Actions', key: 'actions' }
      ]
    }
  },

  methods: {
    dateMStoddmmyyyy,
    openCreateSupplierDialog() {
      this.createDialog = true
    },

    openUpdateSupplierDialog(item) {
      this.selectedSupplier = item
      this.updateDialog = true
    },

    openDeleteSupplierDialog(item) {
      this.selectedSupplier = item
      this.deleteDialog = true
    },

    async refreshSuppliers() {
      this.overlay = true
      await this.supplierListMethod()
      this.overlay = false
    }
  }
}
</script>
