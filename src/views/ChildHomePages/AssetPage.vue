<template>
  <v-container fluid class="pa-6">
    <!-- Overlay -->
    <OverlayComp :overlay="overlay" />

    <!-- PAGE HEADER -->
    <v-toolbar flat class="mb-4">
      <v-layout class="align-center ga-3">
        <v-icon color="primary" :size="mdAndUp ? 55 : 35">
          mdi-cube-outline
        </v-icon>

        <v-layout class="flex-column">
          <v-toolbar-title class="font-weight-bold">
            Asset Management
            <v-icon
              size="22"
              class="cursor-pointer ml-2"
              color="primary"
              @click="refreshAssetList"
            >
              mdi-refresh
            </v-icon>
          </v-toolbar-title>

          <span class="subtitle">
            Create, track, and manage assets
          </span>
        </v-layout>
      </v-layout>

      <v-spacer />

      <!-- Mobile -->
      <v-btn
        class="d-flex d-sm-none"
        icon
        color="primary"
        variant="flat"
        rounded="circle"
        width="40"
        height="40"
        @click="openCreateDialog"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <!-- Desktop -->
      <v-btn
        class="d-none d-sm-flex"
        color="primary"
        variant="flat"
        rounded="lg"
        @click="openCreateDialog"
      >
        <v-icon start>mdi-plus</v-icon>
        Add Asset
      </v-btn>
    </v-toolbar>

    <!-- ASSET TABLE -->
    <v-card elevation="2" rounded="lg">
      <v-card-text class="pa-2 d-flex align-center">
        <v-spacer />

                  <v-col cols="12"  sm="3" md="3" lg="3" xl="3" class="pa-0">

          <v-text-field
            v-model="search"
            label="Search Asset"
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
        :items="AssetListArray"
        :search="search"
        fixed-header
        :height="tableHeight"
        density="comfortable"
      >
        <!-- STATUS -->
        <template v-slot:[`item.created_on`]="{ item }">
          <div
          >
            {{dateMStoddmmyyyy(item.created_on )}}
          </div>
        </template>
         <template v-slot:[`item.sub_category_name`]="{ item }">
          <div
          >
            {{item.sub_category_name?item.sub_category_name:'- - -' }}
          </div>
        </template>

        <!-- ACTIONS -->
        <template v-slot:[`item.actions`]="{ item }">
          <div @click.stop>
            <v-menu location="bottom end">
              <template #activator="{ props }">
                <v-btn
                  icon
                  variant="text"
                  rounded="circle"
                  size="32"
                  v-bind="props"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item @click="openEditDialog(item)">
                  <template #prepend>
                    <v-icon color="success">mdi-pencil</v-icon>
                  </template>
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>

                <v-list-item @click="openDeleteDialog(item)">
                  <template #prepend>
                    <v-icon color="error">mdi-delete</v-icon>
                  </template>
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- DIALOGS -->
    <CreateAssetDialog
      v-model:CreateAssetDialog="createDialog"
      @success="refreshAssetList"
    />

   <UpdateAssetDialog
      v-model:UpdateAssetDialog="updateDialog"
      :asset="selectedAsset"
      @success="refreshAssetList"
    />

    <DeleteAssetDialog 
      v-model:DeleteAssetDialog="deleteDialog"
      :asset="selectedAsset"
      @success="refreshAssetList"
    /> 
  </v-container>
</template>

<script>
import OverlayComp from '@/components/Extras/OverlayComp.vue'
import CreateAssetDialog from '@/components/AssetPageComponents/Dialogs/CreateAssetDialog.vue';
import UpdateAssetDialog from '@/components/AssetPageComponents/Dialogs/UpdateAssetDialog.vue';
import DeleteAssetDialog from '@/components/AssetPageComponents/Dialogs/DeleteAssetDialog.vue';
import { AssetList } from '@/mixins/AssetUser/AssetList';
import { dateMStoddmmyyyy } from '@/utils/DateMStoddmmyyy';

export default {
  components: {
    OverlayComp,
    CreateAssetDialog,
    UpdateAssetDialog,
    DeleteAssetDialog
  },
mixins:[AssetList],
  data() {
    return {
      overlay: false,
      search: '',
      tableHeight: 0,

      createDialog: false,
      updateDialog: false,
      deleteDialog: false,

      selectedAsset: {},

      headers: [
        { title: 'Asset Name', key: 'asset_name', align: 'start' },
        { title: 'Category', key: 'category_name', align: 'start' },
        { title: 'Sub Category', key: 'sub_category_name', align: 'start' },
        { title: 'Manufacturer', key: 'manufacturer_name', align: 'start' },
        { title: 'Supplier', key: 'supplier_name', align: 'start' },
        { title: 'Created On', key: 'created_on', align: 'start' },
        { title: 'Actions', key: 'actions', align: 'start' }
      ]
    }
  },

  computed: {
    mdAndUp() {
      return this.$vuetify.display.mdAndUp
    }
  },

  mounted() {
    this.tableHeight = window.innerHeight - 350
    this.refreshAssetList()
  },

  watch: {
    '$vuetify.display.height'(val) {
      this.tableHeight = val - 320
    }
  },

  methods: {
    dateMStoddmmyyyy,
    openCreateDialog() {
      this.createDialog = true
    },

    openEditDialog(item) {
      this.selectedAsset = item
      this.updateDialog = true
    },

    openDeleteDialog(item) {
      this.selectedAsset = item
      this.deleteDialog = true
    },

    async refreshAssetList() {
      this.overlay = true
      await this.getAssetListMethod()
      this.overlay = false
    }
  }
}
</script>
