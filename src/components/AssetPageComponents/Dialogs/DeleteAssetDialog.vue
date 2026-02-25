<template>
  <v-dialog :model-value="DeleteAssetDialog" persistent max-width="420">
    <SnackbarComp :snackbarComponent="snackbarComponent" />

    <v-card rounded="lg">
      <!-- HEADER -->
      <v-toolbar color="primary">
        <v-toolbar-title>Delete Asset</v-toolbar-title>
        <v-icon @click="closeDeleteAssetDialog">mdi-close</v-icon>
      </v-toolbar>

      <!-- CONTENT -->
      <v-card-text class="pt-6">
        <div class="d-flex align-center">
          <v-icon color="error" size="36" class="mr-3">
            mdi-alert-circle-outline
          </v-icon>

          <div>
            <h3 class="font-weight-medium">Are you sure?</h3>
            <p class="text-grey">
              This action will permanently delete the asset
              <strong>{{ asset?.asset_name || 'Selected Asset' }}</strong>.
            </p>
          </div>
        </div>
      </v-card-text>

      <!-- ACTIONS -->
      <v-card-actions class="mr-3 d-flex justify-end">
        <v-btn
          variant="outlined"
          color="primary"
          class="fontVariant1"
          :disabled="loading"
          @click="closeDeleteAssetDialog"
        >
          Cancel
        </v-btn>

        <v-btn
          variant="flat"
          color="error"
          class="fontVariant1"
          :loading="loading"
          @click="DeleteAssetDialogMethod"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import SnackbarComp from '@/components/Extras/SnackbarComp.vue'
import { generateClient } from 'aws-amplify/api'
import { deleteAsset } from '@/graphql/mutations'

const client = generateClient()

export default {
  name: 'DeleteAssetDialog',

  props: {
    DeleteAssetDialog: {
      type: Boolean,
      required: true
    },
    asset: {
      type: Object,
      required: true
    }
  },

  emits: ['update:DeleteAssetDialog', 'success'],

  components: { SnackbarComp },

  data() {
    return {
      loading: false,
      snackbarComponent: {
        snackBarModel: false,
        color: '',
        message: ''
      }
    }
  },

  methods: {
    showSnackBar(color, message) {
      this.snackbarComponent = {
        snackBarModel: true,
        color,
        message
      }
      setTimeout(() => {
        this.snackbarComponent.snackBarModel = false
      }, 1500)
    },

    closeDeleteAssetDialog() {
      this.$emit('update:DeleteAssetDialog', false)
    },

    async DeleteAssetDialogMethod() {
      if (!this.asset?.asset_id) {
        this.showSnackBar('error', 'Invalid asset selected')
        return
      }

      this.loading = true
      try {
        const res = await client.graphql({
          query: deleteAsset,
          variables: {
            input: {
              asset_id: this.asset.asset_id
            }
          }
        })

        const resultObj = JSON.parse(res.data.deleteAsset)

        if (resultObj.status === 'SUCCESS') {
          this.showSnackBar('success', resultObj.status_message)
          setTimeout(() => {
            this.$emit('success')
            this.closeDeleteAssetDialog()
          }, 800)
        } else {
          this.showSnackBar('error', resultObj.status_message)
        }
      } catch (e) {
        console.error(e)
        this.showSnackBar('error', 'Failed to delete asset')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
