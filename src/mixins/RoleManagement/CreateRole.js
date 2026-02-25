import { generateClient } from "aws-amplify/api"
import { createRole } from "@/graphql/mutations"
const client = generateClient();
export const CreateRole = {
  data() {
    return {
      form: {
        roleId: "",
        roleName: "",
        status: "ACTIVE"
      },
      snackbarComponent: {},
    }
  },
  methods: {
    async CreateRoleMethod() {
      const inputParams = {
        role_id: this.form.roleId,
        role_name: this.form.roleName,
        role_status: this.form.status
      }
      const response = await client.graphql({
        query: createRole,
        variables: {
          input: inputParams
        }
      });
      console.log('created role response', response.data)


      if (response) {
        this.snackbarComponent = {
          snackBarModel: true,
          color: "success",
          message: "Role created successfully...",
        };

      }
    }
  },
}