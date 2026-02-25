<template>
  <v-container fluid>
    <OverlayComp :overlay="overlay"></OverlayComp>
    <v-row v-if="status === 'SUCCESS'">
      <v-col cols="12">
        <v-toolbar>
          <v-layout row wrap class="align-center ga-2">
            <v-icon color="primary" :size="mdAndUp ? 55 : 35"
              >mdi-domain</v-icon
            >
            <v-layout class="flex-column">
              <v-toolbar-title class="d-flex align-center">
                Orgnization List
                <v-icon
                  size="24"
                  class="cursor-pointer"
                  color="primary"
                  @click="refreshOrganisationList"
                  >mdi-refresh</v-icon
                ></v-toolbar-title
              >
              <p class="subtitle">View List of Orgnization</p>
            </v-layout>
          </v-layout>
        </v-toolbar>
      </v-col>
      <v-col cols="12">
        <v-card elevation="2">
          <v-data-table
            :headers="headers"
            :items="getOrganisationListArray"
            :height="Math.max(tableHeight, 200)"
          >
            <template v-slot:[`item.created_on`]="{ item }">
              <div>{{ formatDate(item.created_on) }}</div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-toolbar v-else>
      <v-toolbar-title>{{ noData }}</v-toolbar-title>
    </v-toolbar>
  </v-container>
</template>

<script>
import OverlayComp from "@/components/Extras/OverlayComp.vue";
import { getOrganisationList } from "@/mixins/OrganisationManagement/getOrganisationList";
import { formatDate } from "@/utils/DateFormater";
export default {
  components: {
    OverlayComp,
  },
  data() {
    return {
      headers: [
        { title: "Org ID", key: "org_id" },
        { title: "Org Name", key: "org_name" },
        { title: "Owner Name", key: "org_owner_name" },
        { title: "Org Email", key: "org_email" },
        { title: "Address", key: "address" },
        { title: "Created On", key: "created_on" },
      ],
      tableHeight: 0,
    };
  },
  mixins: [getOrganisationList],
  methods: {
    formatDate,
    async refreshOrganisationList() {
      await this.getOrganisationListMethod();
    },
  },
  async mounted() {
    await this.getOrganisationListMethod();
    this.tableHeight = window.innerHeight - 270;
  },
  computed: {
    mdAndUp() {
      return this.$vuetify.display.mdAndUp;
    },
  },
  watch: {
    "$vuetify.display.height"(val) {
      this.tableHeight = val - 270;
    },
  },
};
</script>

<style scoped></style>
