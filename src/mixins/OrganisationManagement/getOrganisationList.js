import { generateClient } from "aws-amplify/api";
import { listOrganisations } from "@/graphql/queries";

const client = generateClient();

export const getOrganisationList = {
  data() {
    return {
      overlay: false,
      noData: "",
      getOrganisationListArray: [],
      status: "", // 👈 add status
    };
  },

  methods: {
    async getOrganisationListMethod() {
      this.overlay = true;
      this.noData = "";
      this.status = "";

      try {
        const response = await client.graphql({
          query: listOrganisations,
        });

        const resultObj = JSON.parse(response.data.listOrganisations);

        this.status = resultObj.status;
        this.getOrganisationListArray = resultObj.data || [];

        if (!this.getOrganisationListArray.length) {
          this.noData = "No organisations found";
        }
      } catch (e) {
        console.error("getOrganisationList error", e);

        const message =
          e?.errors?.[0]?.message ||
          e?.message ||
          "";

        if (
          message.toLowerCase().includes("unauthorized") ||
          message.toLowerCase().includes("not authorized") ||
          message.toLowerCase().includes("access denied")
        ) {
          this.noData = "YOU ARE NOT AUTHORISED TO VIEW THE ORGANISATIONS";
        } else {
          this.noData = "Failed to load organisations";
        }

        this.status = "ERROR";
        this.getOrganisationListArray = [];
      } finally {
        this.overlay = false;
      }
    },
  },
};
