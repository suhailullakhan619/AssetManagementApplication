<template>
  <v-dialog :model-value="modelValue" persistent max-width="450">
    <SnackbarComp :snackbarComponent="snackbarComponent" />

    <v-card rounded="lg">
      <!-- HEADER -->
      <v-toolbar color="primary">
        <v-toolbar-title>Create Supplier</v-toolbar-title>
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

          <!-- STATUS (HIDDEN / DEFAULT ACTIVE) -->
          <!-- Not shown to user, sent as ACTIVE -->
        </v-card-text>

        <!-- ACTIONS -->
        <v-card-actions class="mr-3 d-flex justify-end">
          <v-btn
            variant="outlined"
            color="redBtnColor"
            @click="closeDialog"
            :disabled="loading"
            class="fontVariant1"
          >
            Cancel
          </v-btn>

          <v-btn
          class="fontVariant1"
            variant="flat"
            color="primary"
            :loading="loading"
            @click="validateAndCreate"
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
  name: 'CreateSupplierDialog',

  props: {
    modelValue: {
      type: Boolean,
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

      // 🔹 Matches createSupplierInput exactly
      form: {
        supplier_name: '',
        supplier_status: 'ACTIVE', // ✅ default ACTIVE
        supplier_number: '',
        supplier_email: ''
      },

      emailRules: [
        v => !!v || 'Supplier Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
      ]
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

    async validateAndCreate() {
      const { valid } = await this.$refs.formRef.validate()
      if (!valid) {
        this.showSnackBar('error', 'Fields marked with * are mandatory')
        return
      }
      this.createSupplier()
    },

    async createSupplier() {
      this.loading = true
      try {
        const res = await this.createSupplierMethod({
          supplier_name: this.form.supplier_name,
          supplier_status: this.form.supplier_status, // ACTIVE
          supplier_number: this.form.supplier_number,
          supplier_email: this.form.supplier_email
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
        this.showSnackBar('error', 'Failed to create supplier')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
