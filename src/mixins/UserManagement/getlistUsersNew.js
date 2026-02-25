import { listUsersNew } from "@/graphql/queries";
import { generateClient } from "aws-amplify/api";
const client = generateClient();
export const getlistUsersNew = {
  data() {
    return {
      overlay: false,
      noDataText: "",
      getlistUsersNewArray: [],
    };
  },
  methods: {
    async getlistUsersNewMethod(status) {
      this.overlay = true;
      try {
        const inputParams = {
          user_status: status,
        };
        const result = await client.graphql({
          query: listUsersNew,
          variables: {
            input: inputParams,
          },
        });

        console.log("result", result);
        const resultObj = JSON.parse(result.data.listUsersNew);
        if (resultObj.status === "SUCCESS") {
          this.getlistUsersNewArray = JSON.parse(result.data.listUsersNew).data;
          console.log("getlistUsersNewArray", this.getlistUsersNewArray)
        }
      } catch (error) {
        this.noDataText = error;
        this.getlistUsersNewArray = [];
      } finally {
        this.overlay = false;
      }
    },

  },
};
