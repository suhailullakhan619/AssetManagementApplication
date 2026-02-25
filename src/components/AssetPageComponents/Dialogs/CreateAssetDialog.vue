<template>
  <v-dialog :model-value="CreateAssetDialog" max-width="520" persistent>
    <SnackbarComp :snackbarComponent="snackbarComponent"/>
    <v-card rounded="lg">
      <v-toolbar color="primary">
        <v-toolbar-title class="font-weight-bold">
          Create Asset
        </v-toolbar-title>
        <v-icon @click="CreateAssetDialogclose">mdi-close</v-icon>
      </v-toolbar>

      <v-divider />

      <v-card-text class="pa-4">
        <v-form ref="formRef" v-model="valid" @submit.prevent="validateCreateAssetDialogForm">
          <!-- Asset Name -->
          <v-text-field
            v-model="form.asset_name"
            label="Asset Name*"
            variant="outlined"
            density="comfortable"
            :rules="[v => !!v || 'Asset name is required']"
            required
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
            :rules="[requiredRule]"
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
  :rules="[requiredRule]"
  :disabled="!form.category_id"
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
            :rules="[requiredRule]"
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
            :rules="[requiredRule]"
          />
           <!-- Created Date  -->
<!-- <v-text-field
  v-model="form.asset_verification_date"
  label="Asset Date*"
  type="date"
  variant="outlined"
  density="comfortable"
  :rules="[v => !!v || 'Date is required']"
  required
/> -->
<!-- Asset Date -->
<v-menu
  v-model="dateMenu"
  :close-on-content-click="false"
  transition="scale-transition"
>
  <template #activator="{ props }">
    <v-text-field
      v-bind="props"
       :model-value="assetDateDisplay"
      label="Asset Date*"
      variant="outlined"
      density="comfortable"
      readonly
      prepend-inner-icon="mdi-calendar"
      :rules="[() => !!form.asset_verification_date || 'Date is required']"
      required
    />
  </template>

 <v-date-picker
  v-model="form.asset_verification_date"
  model-value-type="string"
  color="primary"
  @update:model-value="onDateSelect"
/>
</v-menu>

           <v-card-actions class="justify-end">
        <v-btn class="fontVariant1" variant="outlined" color="error" @click="CreateAssetDialogclose">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          type="submit"
          class="fontVariant1"
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
import SnackbarComp from '@/components/Extras/SnackbarComp.vue';
import { categoryList } from '@/mixins/Category/CategoryList.js';
import { generateClient } from 'aws-amplify/api';
const client=generateClient();
import { createAsset } from '@/graphql/mutations';
import { ManufactureList } from '@/mixins/manufacture/ManufactureList.js';
import { supplierList } from '@/mixins/Supplier/SupplierList.js';
export default {
  props: {
    CreateAssetDialog:Boolean,
  },
components:{
SnackbarComp
},
watch: {
  CreateAssetDialog(val) {
    if (val) {
      // dialog opened
      this.loadParentCategories()
    }
  },

  'form.category_id': {
    async handler(categoryId) {
      this.form.sub_category_id = null
      this.subCategoryListArray = []

      if (!categoryId) return

      await this.getCategoryListMethod(categoryId)
      this.subCategoryListArray = [...this.categoryListArray]
    }
  }
},
computed: {
 assetDateDisplay() {
  const val = this.form.asset_verification_date
  if (!val) return ''
  
  // Handle Date object
  const dateStr = val instanceof Date
    ? val.toISOString().split('T')[0]
    : String(val)

  const [y, m, d] = dateStr.split('-')
  return `${d}-${m}-${y}`
}
},
emits: ['update:CreateAssetDialog', 'success'],
mixins:[categoryList,ManufactureList,supplierList],
  data() {
    return {
       dateMenu: false, 
      valid: false,
      loading:false,
  requiredRule: v => !!v || 'This field is required',
      form: {
        asset_name: '',
        category_id: null,
         sub_category_id: null,
        manufacturer_id: null,
        supplier_id: null,
        asset_verification_date: null 
      },
      snackbarComponent:{},
      parentCategoryListArray: [],
    subCategoryListArray: [],
    }
  },
mounted() {
  this.loadParentCategories()
  this.manufactureListMethod()
  this.supplierListMethod()
},
  methods: {
    onDateSelect(val) {
    if (!val) return

  if (val instanceof Date) {
    const y = val.getFullYear()
    const m = String(val.getMonth() + 1).padStart(2, '0')
    const d = String(val.getDate()).padStart(2, '0')
    this.form.asset_verification_date = `${y}-${m}-${d}`
  } else {
    this.form.asset_verification_date = String(val).split('T')[0]
  }

  this.dateMenu = false
  },

    showSnackbar(color,message){
      this.snackbarComponent={
snackBarModel:true,
color:color,
message:message
      }
      setTimeout(()=>{
this.snackbarComponent.snackBarModel=false;
      },2500)
    },
    CreateAssetDialogclose() {
      this.$emit('update:CreateAssetDialog', false)
      this.reset()
    },

    reset() {
     this.$refs.formRef.reset()
      this.form={
        asset_name: '',
        category_id: null,
         sub_category_id: null,
        manufacturer_id: null,
        supplier_id: null,
        asset_verification_date: null 
      }
    },

    async validateCreateAssetDialogForm(){
      const {valid}= await this.$refs.formRef.validate()
      if(!valid){
        this.showSnackbar('error','Fileds Required with (*) Astrisks');
        return;
      }

      await this.CreateAssetDialogSubmit()

    },
    async CreateAssetDialogSubmit() {
       this.loading=true
         const assetDateMs = this.form.asset_verification_date
      ?this.form.asset_verification_date
      : null;
       try{
        const payload = {
        asset_name: this.form.asset_name,
  category_id: this.form.category_id,
  sub_category_id: this.form.sub_category_id,
  manufacturer_id: this.form.manufacturer_id,
  supplier_id: this.form.supplier_id,
  asset_verification_date: assetDateMs 
      }

      console.log('createAssetInput:', payload)
      const result=await client.graphql({
        query:createAsset,
        variables:{
          input:payload
        }
      })
      const resultObj=JSON.parse(result.data.createAsset)
      console.log('cresteResultobj',resultObj)
      if(resultObj.status==='SUCCESS'){
        this.showSnackbar('success',resultObj.status_message)
        setTimeout(()=>{
        this.$emit('success')
        },1000)
        setTimeout(()=>{
      this.CreateAssetDialogclose()
        },1000)
      }
      if(resultObj.status==='ERROR'){
        this.showSnackbar('error',resultObj.status_message)
      }
      
       }catch(e){
  console.log('error in the createAsset',e||e.error[0].message)
  this.showSnackbar('error',e)
       }finally{
        this.loading=false
       }
      
    },
     async loadParentCategories() {
    await this.getCategoryListMethod()
    // ⬇️ copy, don’t reuse
    this.parentCategoryListArray = [...this.categoryListArray]
  }
  }
}
</script>
