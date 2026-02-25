import { generateClient } from "aws-amplify/api"
import { createOrganizationUser, editUser, editUserAsOwner } from "@/graphql/mutations"
const client = generateClient();
export const UserMutations = {
  methods: {
    async CreateUserMethod(input) {

      const response = await client.graphql({
        query: createOrganizationUser,
        variables: {
          input: input
        }
      })
      const parsed = JSON.parse(response.data.createOrganizationUser);
      console.log('create user', response)
      return parsed;
    },
    async UpdateUserMethod(input, editRole) {
      //      const response=await client.graphql({
      //         query:editUser,
      //         variables:{
      //           input:input
      //         }
      //       })
      //        const parsed = JSON.parse(response.data.editUser);
      //  console.log('update user',response)
      //   return parsed; 
      const mutation =
        editRole === 'ORG_OWNER'
          ? editUserAsOwner
          : editUser;

      const response = await client.graphql({
        query: mutation,
        variables: { input }
      });

      const key =
        editRole === 'ORG_OWNER'
          ? 'editUserAsOwner'
          : 'editUser';
      console.log(response.data)
      return JSON.parse(response.data[key]);
    }
  }
}