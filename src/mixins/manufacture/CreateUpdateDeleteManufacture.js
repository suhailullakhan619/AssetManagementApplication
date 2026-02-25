import { generateClient} from "aws-amplify/api";
import { createManufacturer,deleteManufacturer,updateManufacturer } from "@/graphql/mutations";
const client=generateClient()

export const CreateUpdateDeleteManufacture={
  data(){
    return {

    }
  },
  methods: {
    async createManufacturerMethod(input){
      const result =await client.graphql({
        query:createManufacturer,
        variables:{
          input
        }
      })
      const resultObj=JSON.parse(result.data.createManufacturer)
      return resultObj;

    },
    async updateManufacturerMethod(input){
      const result=await client.graphql({
        query:updateManufacturer,
        variables:{
          input:input
        }
      })
      const resultObj=JSON.parse(result.data.updateManufacturer)
return resultObj;
    },
    async deleteManufacturerMethod(input){
  const result=await client.graphql({
    query:deleteManufacturer,
    variables:{
      input:input
    }
  })
  const resultObj=JSON.parse(result.data.deleteManufacturer);
  return resultObj;
    }
  },
}