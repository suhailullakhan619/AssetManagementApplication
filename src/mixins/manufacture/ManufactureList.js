import { generateClient } from "aws-amplify/api";
import { listManufacturer } from "@/graphql/queries";
const client=generateClient();

export const ManufactureList={
  data(){
    return{
      manufactureListArray:[]
    }
  },
  methods: {
    async manufactureListMethod(){
      const result=await client.graphql({
         query:listManufacturer,
      })
      const resultObj=JSON.parse(result.data.listManufacturer)
      console.log('manufacture obj',resultObj)
      this.manufactureListArray=resultObj.data
    }
  },
}