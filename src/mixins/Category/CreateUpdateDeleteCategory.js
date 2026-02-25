import { generateClient } from "aws-amplify/api";
import { createCategory, deleteCategory, updateCategory } from "@/graphql/mutations";
const client=generateClient();
export const CreateUpdateDeleteCategory={
  data() {
    return {
      
    }
  },
  methods: {
    async CreateCategoryMethod(input){
      const result=await client.graphql({
        query:createCategory,
        variables:{
          input:input
        }
      })
      const resultObj=JSON.parse(result.data.createCategory)
      console.log('createCategoryResult',result)
      return resultObj;
    },
    async updateCategoryMethod(input){
   const result=await client.graphql({
        query:updateCategory,
        variables:{
          input:input
        }
      })
      const resultObj=JSON.parse(result.data.updateCategory)
      console.log('updateCategoryResult',result)
      return resultObj;
    },
    async deleteCategoryMethod(input){
   const result= await client.graphql({
        query:deleteCategory,
        variables:{
          input:input
        }
      })
      const resultObj=JSON.parse(result.data.deleteCategory)
      return resultObj;
    }
  },
}