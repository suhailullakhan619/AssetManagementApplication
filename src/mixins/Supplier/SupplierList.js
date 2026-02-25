import { generateClient } from "aws-amplify/api";
import { listSupplier} from "@/graphql/queries";
const client=generateClient();

export const supplierList={
  data(){
    return {
   supplierListArray:[]
    }
  },
  methods:{
async supplierListMethod(){
  const result=await client.graphql({
    query:listSupplier
  })
  const resultObj=JSON.parse(result.data.listSupplier)
  this.supplierListArray=resultObj.data
  console.log('suplier obj',resultObj)
}
  }
}