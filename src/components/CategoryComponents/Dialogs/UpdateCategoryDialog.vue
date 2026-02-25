<template>
  <v-dialog :model-value="modelValue" persistent max-width="400">
    <SnackbarComp :snackbarComponent="snackbarComponent" />

    <v-card rounded="lg">
      <!-- HEADER -->
      <v-toolbar color="primary">
        <v-toolbar-title>Update Category</v-toolbar-title>
        <v-icon @click="closeDialog">mdi-close</v-icon>
      </v-toolbar>

      <!-- FORM -->
      <v-form ref="formRef">
        <v-card-text>
          <!-- CATEGORY NAME -->
          <v-text-field
            v-model="form.category_name"
            label="Category Name*"
            variant="outlined"
            :rules="[v => !!v || 'Category Name is required']"
          />

          <!-- STATUS -->
          <v-select
            v-model="form.category_status"
            label="Category Status"
            variant="outlined"
            :items="statusOptions"
            item-title="title"
            item-value="value"
            density="comfortable"
          />
        </v-card-text>

        <!-- ACTIONS -->
        <v-card-actions class="mr-3 d-flex justify-end">
          <v-btn
          class="fontVariant1"
            variant="outlined"
            color="redBtnColor"
            @click="closeDialog"
            :disabled="loading"
          >
            Cancel
          </v-btn>

          <v-btn
          class="fontVariant1"
            variant="flat"
            color="primary"
            :loading="loading"
            @click="validateAndUpdate"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import SnackbarComp from '@/components/Extras/SnackbarComp.vue'
import { CreateUpdateDeleteCategory } from '@/mixins/Category/CreateUpdateDeleteCategory'

export default {
  name: 'UpdateCategoryDialog',

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
      snackbarComponent: {},

      form: {
        category_id: '',
        org_id: '',
        category_name: '',
        category_status: 'ACTIVE'
      },

      statusOptions: [
        { title: 'Active', value: 'ACTIVE' },
        { title: 'Inactive', value: 'INACTIVE' }
      ]
    }
  },

  watch: {
    // Prefill data when dialog opens
    modelValue(val) {
      if (val && this.category) {
        this.form = {
          category_id: this.category.category_id,
          org_id: this.category.org_id,
          category_name: this.category.category_name,
          category_status: this.category.category_status
        }
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
      }, 2500)
    },

    closeDialog() {
      this.$refs.formRef?.reset()
      this.$emit('update:modelValue', false)
    },

    async validateAndUpdate() {
      const { valid } = await this.$refs.formRef.validate()
      if (!valid) {
        this.showSnackBar('error', 'Fields marked with * are mandatory')
        return
      }

      this.updateCategory()
    },

    async updateCategory() {
      this.loading = true

      try {
        const res = await this.updateCategoryMethod({
          category_id: this.form.category_id,
          org_id: this.form.org_id,
          category_name: this.form.category_name,
          category_status: this.form.category_status
        })

        if (res.status === 'Category updated') {
          this.showSnackBar('success', res.status_message)

          setTimeout(() => {
            this.closeDialog()
            this.$emit('success')
          }, 800)
        } else {
          this.showSnackBar('error', res.status_message)
        }
      } catch (e) {
        this.showSnackBar('error', e||'Failed to update category')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
