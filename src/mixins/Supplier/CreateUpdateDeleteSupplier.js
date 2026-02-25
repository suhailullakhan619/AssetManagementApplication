import { generateClient } from "aws-amplify/api";
import { createSupplier, deleteSupplier, updateSupplier } from "@/graphql/mutations";
const client=generateClient();
export const CreateUpdateDeleteSupplier={
  data(){
    return {

    }
  },
  methods:{
    async createSupplierMethod(input){
      const result=await client.graphql({
        query: createSupplier,
        variables:{
          input:input
        }
      })
      const resultObj=JSON.parse(result.data.createSupplier)
      return resultObj;
    },

    async updateSupplierMethod(input){
      const result=await client.graphql({
        query:updateSupplier,
        variables:{
          input:input
        }
      })
      const resultObj=JSON.parse(result.data.updateSupplier)
      return resultObj
    },
    
    async  deleteSupplierMethod(input){
      const result=await client.graphql({
        query:deleteSupplier,
        variables:{
          input:input
        }
      })
      const resultObj=JSON.parse(result.data.deleteSupplier);
      return resultObj
    }
  }
}