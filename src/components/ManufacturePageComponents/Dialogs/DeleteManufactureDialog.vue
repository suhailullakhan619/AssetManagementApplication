<template>
  <v-dialog :model-value="modelValue" persistent max-width="420">
    <SnackbarComp :snackbarComponent="snackbarComponent" />

    <v-card rounded="lg">
      <!-- HEADER -->
      <v-toolbar color="primary">
        <v-toolbar-title>Delete Manufacturer</v-toolbar-title>
        <v-icon @click="closeDialog">mdi-close</v-icon>
      </v-toolbar>

      <!-- CONTENT -->
      <v-card-text class="pt-6">
        <div class="d-flex align-center">
          <v-icon color="error" size="36" class="mr-3">
            mdi-alert-circle-outline
          </v-icon>

          <div>
            <h3 class="font-weight-medium">
              Are you sure?
            </h3>
            <p class="text-grey">
              This action will permanently delete the category
              <strong>{{ manufacturer?.manufacturer_name }}</strong>.
            </p>
          </div>
        </div>
      </v-card-text>

      <!-- ACTIONS -->
      <v-card-actions class="d-flex justify-end pr-4 pb-4">
        <v-btn
        class="fontVariant1"
          variant="outlined"
          color="primary"
          @click="closeDialog"
          :disabled="loading"
        >
          Cancel
        </v-btn>

        <v-btn
        class="fontVariant1"
          color="error"
          variant="flat"
          :loading="loading"
          @click="confirmDelete"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import SnackbarComp from '@/components/Extras/SnackbarComp.vue'
import { CreateUpdateDeleteManufacture } from '@/mixins/manufacture/CreateUpdateDeleteManufacture'

export default {
  name: 'DeleteManufacturerDialog',

  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    manufacturer: {
      type: Object,
      required: true
    }
  },

  components: { SnackbarComp },
  mixins: [CreateUpdateDeleteManufacture],

  emits: ['update:modelValue', 'success'],

  data() {
    return {
      loading: false,
      snackbarComponent: {}
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
      }, 2500)
    },

    closeDialog() {
      this.$emit('update:modelValue', false)
    },

    async confirmDelete() {
      this.loading = true
      try {
        const res = await this.deleteManufacturerMethod({
          manufacturer_id: this.manufacturer.manufacturer_id
        })

        if (res.status === 'SUCCESS') {
          this.showSnackBar('success', res.status_message)

          setTimeout(() => {
            this.closeDialog()
            this.$emit('success')
          }, 800)
        } else {
          this.showSnackBar('error', res.status_message)
        }
      } catch (e) {
        this.showSnackBar('error', e||'Failed to delete manufacturer')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
