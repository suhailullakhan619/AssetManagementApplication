import { listRoles } from "@/graphql/queries";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

export const getRoles = {
  data() {
    return {
      roles: [],
      overlay: false
    };
  },

  methods: {
    async getRolesMethod() {
      try {
        this.overlay = true;
        const result = await client.graphql({
          query: listRoles,
        });
        this.roles = JSON.parse(result.data.listRoles);
      } catch (e) {
        console.log('getRoles error', e);

      } finally {
        this.overlay = false
      }

    },
  },
};
