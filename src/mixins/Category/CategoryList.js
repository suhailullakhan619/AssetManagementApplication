import { listCategories } from "@/graphql/queries";
import { generateClient } from "aws-amplify/api";
const client=generateClient();

export const categoryList={
data(){
  return {
categoryListArray:[]
  }
},
methods:{
  async getCategoryListMethod(parentCategoryId=null){
    const variables=parentCategoryId?{input:{parent_category_id: parentCategoryId}}:{input:{}}
    const result=await client.graphql({
      query:listCategories,
      variables
    })
    const resultObj=JSON.parse(result.data.listCategories)
    console.log('categoryList data',result)
    this.categoryListArray=resultObj.data
  }
}
}