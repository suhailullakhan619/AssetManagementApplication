import { generateClient } from "aws-amplify/api";
import { listAssets } from "@/graphql/queries";
const client=generateClient()

export const AssetList={
  data() {
    return {
      AssetListArray:[]
    }
  },
  methods: {
    async getAssetListMethod(){
      const result=await client.graphql({
        query:listAssets,
      })
      const resultObj=JSON.parse(result.data.listAssets);
      this.AssetListArray=resultObj.data
      console.log('assetLsit',resultObj)
    }
  },
}