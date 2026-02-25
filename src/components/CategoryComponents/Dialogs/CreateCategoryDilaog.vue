<template>
  <v-dialog :model-value="modelValue" persistent max-width="400" >
    <SnackbarComp :snackbarComponent="snackbarComponent"/>
    <v-card rounded="lg">
     <v-toolbar color="primary">
      <v-toolbar-title>Create Category</v-toolbar-title>
      <v-icon @click="CreateCategoryDilaogClose">mdi-close</v-icon>
     </v-toolbar>
     <v-form ref="formRef">
  <v-card-text>
    <!-- CATEGORY TYPE INFO -->
    <v-alert
      v-if="parentCategory"
      type="info"
      variant="tonal"
      class="mb-4"
    >
      Creating child category under
      <strong>{{ parentCategory.category_name }}</strong>
    </v-alert>

    <!-- CATEGORY NAME -->
    <v-text-field
      v-model="categoryName"
      label="Category Name*"
      variant="outlined"
      :rules="[v => !!v || 'Category Name is required']"
    />

    <!-- PARENT CATEGORY (READ ONLY IF CHILD) -->
    <v-text-field
      v-if="parentCategory"
      :model-value="parentCategory.category_name"
      label="Parent Category"
      variant="outlined"
      disabled
    />
  </v-card-text>
  <v-card-actions class="mr-3 d-flex justify-end">
      <v-btn class="fontVariant1" variant="outlined" color="redBtnColor" @click="CreateCategoryDilaogClose">Cancel</v-btn>
      <v-btn class="fontVariant1" variant="flat"  :loading="loading" color="primary" @click="validateCreateCategoryDialogMethod()">Confirm</v-btn>
     </v-card-actions>
</v-form>

    </v-card>
  </v-dialog>
  </template>

  <script>
import SnackbarComp from '@/components/Extras/SnackbarComp.vue';
import { CreateUpdateDeleteCategory } from '@/mixins/Category/CreateUpdateDeleteCategory';

export default{
  props:{
    modelValue:{
      type:Boolean,
      required:true
    },
     parentCategory: {
    type: Object,
    default: null // 👈 null = Parent category
  }
  },
  components:{
    SnackbarComp
  },
  mixins:[CreateUpdateDeleteCategory],
  data(){
return{
loading:false,
categoryName:'',
parentCategoryID:'',
snackbarComponent:{}
}
  },
  emits:['update:modelValue','success'],
  methods:{
    showSnackBar(color,message){
this.snackbarComponent={
snackBarModel:true,
color:color,
message:message
}
setTimeout(()=>{
this.snackbarComponent.snackBarModel=false;
},2500)
    },
    CreateCategoryDilaogClose(){
      this.$refs.formRef?.reset()
      this.$emit('update:modelValue',false)
    },
   async validateCreateCategoryDialogMethod(){
      const {valid}=await this.$refs.formRef.validate();
      if(!valid){
       this.showSnackBar('error','Fields marked with asterisks * are mandatory');
       return;
      } 
      this.CreateCategoryApiMethod()    
    },
    async CreateCategoryApiMethod(){
      this.loading=true;
     const res= await this.CreateCategoryMethod({
        category_name:this.categoryName,
        parent_category_id:this.parentCategory
      ? this.parentCategory.category_id // 👈 child
      : null // 👈 parent
      })
      console.log('res',res)
      if(res.status==='SUCCESS'){ 
      this.showSnackBar('success',res.status_message)
       setTimeout(()=>{
      this.CreateCategoryDilaogClose()
      },500)
      setTimeout(()=>{
      this.$emit('success')
      },1000)
      } if(res.status==='Error'){ 
      this.showSnackBar('error',res.status_message)
      }
      this.loading=false
    }
  }
}
</script>