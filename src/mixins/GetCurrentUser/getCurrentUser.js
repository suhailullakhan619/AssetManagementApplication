import { generateClient } from "aws-amplify/api";
import { CurrentUser } from "@/graphql/queries";
const client = generateClient();
export const getCurrentUser = {
  methods: {
    data() {
      return {
        getCurrentUserDetails: {},
      };
    },
    async getCurrentUserMethod() {
      try {


        const result = await client.graphql({
          query: CurrentUser,
          variables: {
            input: {},
          },
        });



        const resultObj = JSON.parse(result.data.CurrentUser);


        console.log("resultObj", resultObj);


        if (resultObj.status === "Success" && resultObj.data) {
          this.getCurrentUserDetails = resultObj.data;
          console.log("this.getCurrentUserDetails", this.getCurrentUserDetails);
          this.$store.dispatch("setCurrentUser", this.getCurrentUserDetails);
        }
      } catch (e) {
        console.log("getCurrentUserMethod error", e);
        this.getCurrentUserDetails = {};
        this.$store.dispatch("clearCurrentUser");
      }
    },
  },
};
