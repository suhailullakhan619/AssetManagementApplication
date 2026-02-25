<template>
  <v-dialog :model-value="modelValue" persistent max-width="450">
    <SnackbarComp :snackbarComponent="snackbarComponent" />

    <v-card rounded="lg">
      <!-- HEADER -->
      <v-toolbar color="primary">
        <v-toolbar-title>Create Manufacturer</v-toolbar-title>
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

          <!-- CONTACT PERSON -->
          <v-text-field
            v-model="form.manufacturer_contact_person"
            label="Contact Person*"
            variant="outlined"
            :rules="[v => !!v || 'Manufacturer Contact person Name is required']"
          />

          <!-- EMAIL -->
          <v-text-field
            v-model="form.manufacturer_email_id"
            label="Email ID*"
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
import { CreateUpdateDeleteManufacture } from '@/mixins/manufacture/CreateUpdateDeleteManufacture';

export default {
  name: 'CreateManufacturerDialog',

  props: {
    modelValue: {
      type: Boolean,
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
        manufacturer_name: '',
        manufacturer_status: 'ACTIVE',
        manufacturer_contact_person: '',
        manufacturer_email_id: ''
      },


      emailRules: [
        v => !v || /.+@.+\..+/.test(v) || 'Email must be valid',
        v => !!v || 'Manufacturer  Email is required'
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

      this.createManufacturerapiMethod()
    },

    async createManufacturerapiMethod() {
      this.loading = true
      try {
        const res = await this.createManufacturerMethod({
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
        this.showSnackBar('error', 'Failed to create manufacturer')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
