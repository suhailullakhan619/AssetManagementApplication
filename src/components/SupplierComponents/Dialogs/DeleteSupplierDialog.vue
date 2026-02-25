<template>
  <v-dialog :model-value="modelValue" persistent max-width="420">
    <SnackbarComp :snackbarComponent="snackbarComponent" />

    <v-card rounded="lg">
      <!-- HEADER -->
      <v-toolbar color="primary">
        <v-toolbar-title>Delete Supplier</v-toolbar-title>
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
              <strong>{{ supplier?.supplier_name || 'Selected Supplier' }}</strong>.
            </p>
          </div>
        </div>
      </v-card-text>

      <!-- ACTIONS -->
      <v-card-actions class="mr-3 d-flex justify-end">
        <v-btn
          variant="outlined"
          color="primary"
          @click="closeDialog"
          :disabled="loading"
          class="fontVariant1"
        >
          Cancel
        </v-btn>

        <v-btn
        
          variant="flat"
          color="error"
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
import { CreateUpdateDeleteSupplier } from '@/mixins/Supplier/CreateUpdateDeleteSupplier';
export default {
  name: 'DeleteSupplierDialog',

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
mixins:[CreateUpdateDeleteSupplier],
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
      if (!this.supplier?.supplier_id) {
        this.showSnackBar('error', 'Invalid supplier selected')
        return
      }

      this.loading = true
      try {
        const res = await this.deleteSupplierMethod({
          supplier_id: this.supplier.supplier_id
        })

        if (res.status === 'SUCCESS' || res.status === 'Supplier deleted') {
          this.showSnackBar('success', res.status_message)

          setTimeout(() => {
            this.closeDialog()
            this.$emit('success')
          }, 800)
        } else {
          this.showSnackBar('error', res.status_message)
        }
      } catch (e) {
        this.showSnackBar('error', 'Failed to delete supplier')
      } finally {
        this.loading = false
      }
    },


//         async callApiMethod(){
//       this.deleteBtnLoading=true;
//       try{

//         const result = await client.graphql(({
//           query:deleteSupplier,
//           variables:{
//             input:{
//               supplier_id:this.supplier_id
//             }
//           }
//         }));
//        console.log("result",result);


//       }catch(error){
//         const errorMessage = error?.error[0]?.message || error;
//         this.showSnackBar("error",)

//       }finally{
//  this.deleteBtnLoading=false;
//       }
    
//   }

  },
}
</script>
