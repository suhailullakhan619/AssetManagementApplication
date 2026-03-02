import { createOrganisation } from "@/graphql/mutations";
import { generateClient } from "aws-amplify/api";
const client = generateClient();
export const CreateOrganisation = {
  data() {
    return {
      orgForm: {
        org_name: "",
        org_type: "",
        org_email: "",
        org_owner_name: "",
        org_owner_email: "",
        org_owner_password: "",
        address: "",
        snackbarComponent: {}
      }
    }
  },
  methods: {
    async CreateOrganisationMethod() {
      const params = {
        org_name: this.orgForm.org_name,
        org_type: this.orgForm.org_type,
        org_email: this.orgForm.org_email,
        org_owner_name: this.orgForm.org_owner_name,
        org_owner_email: this.orgForm.org_owner_email,
        org_owner_password: this.orgForm.org_owner_password,
        address: this.orgForm.address

      }
      const response = await client.graphql({
        query: createOrganisation,
        variables: {
          input: params
        }
      })
      const parsed=JSON.parse(response.data.createOrganisation)
      console.log('organisation is created', response.data)
      return parsed
    }
  },
}