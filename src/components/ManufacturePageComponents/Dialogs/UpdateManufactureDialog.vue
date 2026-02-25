<template>
  <v-dialog :model-value="modelValue" persistent max-width="450">
    <SnackbarComp :snackbarComponent="snackbarComponent" />

    <v-card rounded="lg">
      <!-- HEADER -->
      <v-toolbar color="primary">
        <v-toolbar-title>Update Manufacturer</v-toolbar-title>
        <v-icon @click="closeDialog">mdi-close</v-icon>
      </v-toolbar>

      <!-- FORM -->
      <v-form ref="formRef">
        <v-card-text>
          <!-- MANUFACTURER NAME -->
          <v-text-field
            v-model="form.manufacturer_name"
            label="Manufacturer Name*"
            variant="outlined"
            :rules="[v => !!v || 'Manufacturer Name is required']"
          />

          <!-- STATUS -->
          <v-select
            v-model="form.manufacturer_status"
            label="Status"
            variant="outlined"
            :items="statusOptions"
            item-title="title"
            item-value="value"
            density="comfortable"
          />

          <!-- CONTACT PERSON -->
          <v-text-field
            v-model="form.manufacturer_contact_person"
            label="Contact Person"
            variant="outlined"
          />

          <!-- EMAIL -->
          <v-text-field
            v-model="form.manufacturer_email_id"
            label="Email ID"
            variant="outlined"
            type="email"
            :rules="emailRules"
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
import { CreateUpdateDeleteManufacture } from '@/mixins/manufacture/CreateUpdateDeleteManufacture'

export default {
  name: 'UpdateManufacturerDialog',

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
      snackbarComponent: {},

      form: {
        manufacturer_id: '',
        manufacturer_name: '',
        manufacturer_status: 'ACTIVE',
        manufacturer_contact_person: '',
        manufacturer_email_id: ''
      },

      statusOptions: [
        { title: 'Active', value: 'ACTIVE' },
        { title: 'Inactive', value: 'INACTIVE' }
      ],

      emailRules: [
        v => !v || /.+@.+\..+/.test(v) || 'Email must be valid'
      ]
    }
  },

  watch: {
    // Prefill form when dialog opens
    modelValue(val) {
      if (val && this.manufacturer) {
        this.form = {
          manufacturer_id: this.manufacturer.manufacturer_id,
          manufacturer_name: this.manufacturer.manufacturer_name,
          manufacturer_status: this.manufacturer.manufacturer_status || 'ACTIVE',
          manufacturer_contact_person: this.manufacturer.manufacturer_contact_person,
          manufacturer_email_id: this.manufacturer.manufacturer_email_id
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

      this.updateManufacturer()
    },

    async updateManufacturer() {
      this.loading = true
      try {
        const res = await this.updateManufacturerMethod({
          manufacturer_id: this.form.manufacturer_id,           // REQUIRED
          manufacturer_name: this.form.manufacturer_name,
          manufacturer_status: this.form.manufacturer_status,
          manufacturer_contact_person: this.form.manufacturer_contact_person,
          manufacturer_email_id: this.form.manufacturer_email_id
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
        this.showSnackBar('error', 'Failed to update manufacturer')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
