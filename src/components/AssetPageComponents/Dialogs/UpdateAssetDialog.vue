<template>
  <v-dialog :model-value="UpdateAssetDialog" max-width="520" persistent>
    <SnackbarComp :snackbarComponent="snackbarComponent"/>

    <v-card rounded="lg">
      <v-toolbar color="primary">
        <v-toolbar-title class="font-weight-bold">
          Edit Asset
        </v-toolbar-title>
        <v-icon @click="close">mdi-close</v-icon>
      </v-toolbar>

      <v-divider />

      <v-card-text class="pa-4">
        <v-form ref="formRef" v-model="valid" @submit.prevent="submit">
          <!-- Asset Name -->
          <v-text-field
            v-model="form.asset_name"
            label="Asset Name"
            variant="outlined"
            density="comfortable"
          />

          <!-- Category -->
          <v-select
            v-model="form.category_id"
            :items="parentCategoryListArray"
            item-title="category_name"
            item-value="category_id"
            label="Category"
            variant="outlined"
            density="comfortable"
            clearable
          />

          <!-- Sub Category -->
          <v-select
            v-model="form.sub_category_id"
            :items="subCategoryListArray"
            item-title="category_name"
            item-value="category_id"
            label="Sub Category"
            variant="outlined"
            density="comfortable"
            clearable
          />

          <!-- Manufacturer -->
          <v-select
            v-model="form.manufacturer_id"
            :items="manufactureListArray"
            item-title="manufacturer_name"
            item-value="manufacturer_id"
            label="Manufacturer"
            variant="outlined"
            density="comfortable"
            clearable
          />

          <!-- Supplier -->
          <v-select
            v-model="form.supplier_id"
            :items="supplierListArray"
            item-title="supplier_name"
            item-value="supplier_id"
            label="Supplier"
            variant="outlined"
            density="comfortable"
            clearable
          />

          <v-card-actions class="justify-end">
            <v-btn class="fontVariant1" variant="outlined" color="error" @click="close">
              Cancel
            </v-btn>
            <v-btn
            class="fontVariant1"
              color="primary"
              type="submit"
              variant="flat"
              :loading="loading"
            >
              Confirm
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import SnackbarComp from '@/components/Extras/SnackbarComp.vue'
import { categoryList } from '@/mixins/Category/CategoryList'
import { ManufactureList } from '@/mixins/manufacture/ManufactureList'
import { supplierList } from '@/mixins/Supplier/SupplierList'
import { generateClient } from 'aws-amplify/api'
import { updateAsset } from '@/graphql/mutations'

const client = generateClient()

export default {
  props: {
    UpdateAssetDialog: Boolean,
    asset: Object
  },

  emits: ['update:UpdateAssetDialog', 'success'],

  components: { SnackbarComp },

  mixins: [categoryList, ManufactureList, supplierList],

  data() {
    return {
      valid: false,
      loading: false,
    isInitializing: false,
      form: {
        asset_id: null,
        asset_name: '',
        category_id: null,
        sub_category_id: null,
        manufacturer_id: null,
        supplier_id: null
      },

      parentCategoryListArray: [],
      subCategoryListArray: [],

      snackbarComponent: {
        snackBarModel: false,
        color: '',
        message: ''
      }
    }
  },

   watch: {
     UpdateAssetDialog(val) {
    if (val) {
      this.init()
    }
  },
  'form.category_id': async function (categoryId) {
    if (this.isInitializing) return   // ✅ prevent reset during init

    this.form.sub_category_id = null
    this.subCategoryListArray = []

    if (!categoryId) return

    await this.getCategoryListMethod(categoryId)
    this.subCategoryListArray = [...this.categoryListArray]
}
  },

  methods: {
    async init() {
  this.isInitializing = true

  // Load parent categories
  await this.getCategoryListMethod()
  this.parentCategoryListArray = [...this.categoryListArray]

  await this.manufactureListMethod()
  await this.supplierListMethod()

  // Set form values
  this.form = {
    asset_id: this.asset.asset_id,
    asset_name: this.asset.asset_name,
    category_id: this.asset.category_id,
    sub_category_id: this.asset.sub_category_id,
    manufacturer_id: this.asset.manufacturer_id,
    supplier_id: this.asset.supplier_id
  }

  // Load sub categories BEFORE enabling watcher
  if (this.asset.category_id) {
    await this.getCategoryListMethod(this.asset.category_id)
    this.subCategoryListArray = [...this.categoryListArray]
  }

  this.isInitializing = false
}
,

    showSnackbar(color, message) {
      this.snackbarComponent = {
        snackBarModel: true,
        color,
        message
      }
      setTimeout(() => {
        this.snackbarComponent.snackBarModel = false
      }, 2500)
    },

    close() {
      this.$emit('update:UpdateAssetDialog', false)
      this.$refs.formRef?.reset()
    },

    async submit() {
      this.loading = true
      try {
        const payload = { ...this.form }

        const res = await client.graphql({
          query: updateAsset,
          variables: { input: payload }
        })

        const resultObj = JSON.parse(res.data.updateAsset)

        if (resultObj.status === 'SUCCESS') {
          this.showSnackbar('success', resultObj.status_message)
          this.$emit('success')
          this.close()
        } else {
          this.showSnackbar('error', resultObj.status_message)
        }
      } catch (e) {
        this.showSnackbar('error', 'Failed to update asset')
        console.error(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

