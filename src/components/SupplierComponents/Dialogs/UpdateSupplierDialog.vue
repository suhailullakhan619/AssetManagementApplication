<template>
  <v-dialog :model-value="modelValue" persistent max-width="450">
    <SnackbarComp :snackbarComponent="snackbarComponent" />

    <v-card rounded="lg">
      <!-- HEADER -->
      <v-toolbar color="primary">
        <v-toolbar-title>Update Supplier</v-toolbar-title>
        <v-icon @click="closeDialog">mdi-close</v-icon>
      </v-toolbar>

      <!-- FORM -->
      <v-form ref="formRef">
        <v-card-text>
          <!-- SUPPLIER NAME -->
          <v-text-field
            v-model="form.supplier_name"
            label="Supplier Name*"
            variant="outlined"
            :rules="[v => !!v || 'Supplier Name is required']"
          />

          <!-- SUPPLIER NUMBER -->
          <v-text-field
            v-model="form.supplier_number"
            label="Supplier Phone Number*"
            variant="outlined"
            :rules="[v => !!v || 'Supplier Number is required']"
          />

          <!-- SUPPLIER EMAIL -->
          <v-text-field
            v-model="form.supplier_email"
            label="Supplier Email*"
            variant="outlined"
            type="email"
            :rules="emailRules"
          />

          <!-- STATUS -->
          <v-select
            v-model="form.supplier_status"
            label="Status"
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
import { CreateUpdateDeleteSupplier } from '@/mixins/Supplier/CreateUpdateDeleteSupplier';
export default {
  name: 'UpdateSupplierDialog',

  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    supplier: {
      type: Object,
      required: true
    }
  },

  components: { SnackbarComp },
  mixins: [CreateUpdateDeleteSupplier],

  emits: ['update:modelValue', 'success'],

  data() {
    return {
      loading: false,
      snackbarComponent: {},

      // 🔹 Matches updateSupplierInput
      form: {
        supplier_id: '',
        supplier_name: '',
        supplier_status: 'ACTIVE',
        supplier_number: '',
        supplier_email: ''
      },

      statusOptions: [
        { title: 'Active', value: 'ACTIVE' },
        { title: 'Inactive', value: 'INACTIVE' }
      ],

      emailRules: [
        v => !!v || 'Supplier Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
      ]
    }
  },

  watch: {
    // Prefill data when dialog opens
    modelValue(val) {
      if (val && this.supplier) {
        this.form = {
          supplier_id: this.supplier.supplier_id,
          supplier_name: this.supplier.supplier_name,
          supplier_status: this.supplier.supplier_status,
          supplier_number: this.supplier.supplier_number,
          supplier_email: this.supplier.supplier_email
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
      this.updateSupplier()
    },

    async updateSupplier() {
      this.loading = true
      try {
        const res = await this.updateSupplierMethod({
          supplier_id: this.form.supplier_id,
          supplier_name: this.form.supplier_name,
          supplier_status: this.form.supplier_status,
          supplier_number: this.form.supplier_number,
          supplier_email: this.form.supplier_email
        })

        if (res.status === 'SUCCESS' || res.status === 'Supplier updated') {
          this.showSnackBar('success', res.status_message)

          setTimeout(() => {
            this.closeDialog()
            this.$emit('success')
          }, 800)
        } else {
          this.showSnackBar('error', res.status_message)
        }
      } catch (e) {
        this.showSnackBar('error', 'Failed to update supplier')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
