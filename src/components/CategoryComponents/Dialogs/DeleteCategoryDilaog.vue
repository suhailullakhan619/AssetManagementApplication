<template>
  <v-dialog :model-value="modelValue" persistent max-width="420">
    <SnackbarComp :snackbarComponent="snackbarComponent" />

    <v-card rounded="lg">
      <!-- HEADER -->
      <v-toolbar color="primary">
        <v-toolbar-title class="text-white">
          Delete Category
        </v-toolbar-title>
        <v-icon class="text-white" @click="closeDialog">
          mdi-close
        </v-icon>
      </v-toolbar>

      <!-- BODY -->
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
              <strong>{{ category?.category_name }}</strong>.
            </p>
          </div>
        </div>
      </v-card-text>

      <!-- ACTIONS -->
      <v-card-actions class="justify-end pa-4">
        <v-btn
        class="fontVariant1"
          variant="outlined"
          color="primary"
          :disabled="loading"
          @click="closeDialog"
        >
          Cancel
        </v-btn>

        <v-btn
        class="fontVariant1"
          color="error"
          variant="flat"
          :loading="loading"
          @click="deleteCategory"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import SnackbarComp from '@/components/Extras/SnackbarComp.vue'
import { CreateUpdateDeleteCategory } from '@/mixins/Category/CreateUpdateDeleteCategory'

export default {
  name: 'DeleteCategoryDialog',

  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    category: {
      type: Object,
      required: true
    }
  },

  components: { SnackbarComp },
  mixins: [CreateUpdateDeleteCategory],

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

    async deleteCategory() {
      this.loading = true

      try {
        const res = await this.deleteCategoryMethod({
          category_id: this.category.category_id,
          org_id: this.category.org_id
        })

        if (res.status === 'Category deleted') {
          this.showSnackBar('success', res.status_message)

          setTimeout(() => {
            this.closeDialog()
            this.$emit('success')
          }, 700)
        } else {
          this.showSnackBar('error', res.status_message)
        }
      } catch (e) {
        this.showSnackBar('error', e || 'Failed to delete category')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
