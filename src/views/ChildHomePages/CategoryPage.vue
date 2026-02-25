<template>
  <v-container fluid class="pa-6">
<OverlayComp :overlay="overlay"/>
    <!-- PAGE HEADER -->
    <v-toolbar flat class="mb-4">
      <v-layout row wrap class="align-center ga-3">
        <v-icon color="primary" :size="mdAndUp?55:35">mdi-palette-swatch-outline</v-icon>
        <v-layout class="flex-column">
          <v-toolbar-title class="font-weight-bold">
            Category Management
            <v-icon
                    size="24"
                    class="cursor-pointer"
                    @click="loadFromRoute"
                    color="primary"
                    >mdi-refresh</v-icon>
          </v-toolbar-title>
          <span class="subtitle">
            Create, organize, and manage categories
          </span>
        </v-layout>
      </v-layout>

      <v-spacer />

      <v-btn
      v-if="!this.$route.query.parentId"
      class="d-flex d-sm-none"
      icon=""
        color="primary"
        variant="flat"
        rounded="circle"
        @click=" OpenCreateCategoryDilaog"
      >
        <v-icon >mdi-plus</v-icon>
      </v-btn>
      <v-btn
      v-if="!this.$route.query.parentId"
        color="primary"
        variant="flat"
        rounded="lg"
        class="d-none d-sm-flex"
        @click=" OpenCreateCategoryDilaog"
      >
        <v-icon start>mdi-plus</v-icon>
   Add Category
      </v-btn>
    </v-toolbar>


    <!-- CATEGORY TABLE -->
    <v-card elevation="2" rounded="lg">
       <v-card-text  class="pa-2 d-flex justify-end">
      <v-breadcrumbs v-if="$route.query.parentName">
  <v-breadcrumbs-item
    title="Categories"
    @click="$router.push({ name: 'CategoryPage' })"
    class="cursor-pointer"
  />
  <v-breadcrumbs-item
    :title="$route.query.parentName"
    disabled
  />
</v-breadcrumbs>
    <v-spacer></v-spacer>
            <v-col cols="12"  sm="3" md="3" lg="3" xl="3" class="pa-0">
          <v-text-field
            label="Search Category"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-magnify"
            hide-details
            v-model="search"
          />
        </v-col>
      </v-card-text>
      <v-divider></v-divider>
      <v-data-table
        :headers="headers"
        :items="categoryListArray"
        density="comfortable"
        fixed-header
        :height="tableHeight"
        :search="search"
        @click:row="onRowClick"
      >
       <template v-slot:[`item.category_status`]="{item}">
          <v-chip density="comfortable" :color="item.category_status==='ACTIVE'?'green':'red' ">{{ item.category_status }}</v-chip>
        </template>

        <!-- ACTIONS -->
        <template v-slot:[`item.actions`]="{item}">
          <div @click.stop>
          <v-menu location="bottom end">
            <template #activator="{ props }">
              <v-btn
                icon
                variant="text"
                v-bind="props"
                rounded="circle"
                size="32"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="OpenUpdateCategoryDilaog(item)">
                <template #prepend>
                  <v-icon color="success">mdi-pencil</v-icon>
                </template>
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>
              <v-list-item v-if="!$route.query.parentId" @click="OpenCreateChildCategory(item)">
  <template #prepend>
    <v-icon color="primary">mdi-plus</v-icon>
  </template>
  <v-list-item-title>Add Child Category</v-list-item-title>
</v-list-item>

              <v-list-item @click="OpenDeleteCategoryDilaog(item)">
                <template #prepend>
                  <v-icon color="error">mdi-delete</v-icon>
                </template>
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- CREATE CATEGORY DIALOG -->
    <CreateCategoryDilaog v-model="CreateCategoryDilaog" :parentCategory="selectedParentCategory"  @success="loadFromRoute" />
    <UpdateCategoryDialog v-model="updateDialog" :category="selectedCategory" @success="loadFromRoute"
/>
<DeleteCategoryDilaog
  v-model="deleteDialog"
  :category="selectedCategory"
  @success="loadFromRoute"
/>

  </v-container>
</template>


<script>
import CreateCategoryDilaog from '@/components/CategoryComponents/Dialogs/CreateCategoryDilaog.vue';
import OverlayComp from '@/components/Extras/OverlayComp.vue';
import UpdateCategoryDialog from '@/components/CategoryComponents/Dialogs/UpdateCategoryDialog.vue';
import { categoryList } from '@/mixins/Category/CategoryList';
import DeleteCategoryDilaog from '@/components/CategoryComponents/Dialogs/DeleteCategoryDilaog.vue';

export default {
  components: {
    CreateCategoryDilaog,
    OverlayComp,
    UpdateCategoryDialog,
    DeleteCategoryDilaog
  },
  mixins: [categoryList],

  mounted() {
    this.tableHeight = window.innerHeight - 350
    this.loadFromRoute()
  },

  computed: {
    mdAndUp() {
      return this.$vuetify.display.mdAndUp
    },
  },

  watch: {
    '$vuetify.display.height'(val) {
      this.tableHeight = val - 280
    },
    '$route.query.parentId': {
      immediate: true,
      handler() {
        this.loadFromRoute()
      }
    }
  },

  data() {
    return {
      currentParentCategory: null,
      selectedParentCategory: null,
      selectedCategory: {},

      CreateCategoryDilaog: false,
      updateDialog: false,
      deleteDialog: false,

      overlay: false,
      search: '',
      tableHeight: 0,

      headers: [
        { title: 'Category Name', key: 'category_name' },
        { title: 'Category Status', key: 'category_status' },
        { title: 'Category Type', key: 'category_type' },
        { title: 'Actions', key: 'actions' },
      ]
    }
  },

  methods: {
    OpenCreateCategoryDilaog() {
      if (this.$route.query.parentId) {
    // We are inside a parent → add child
    this.selectedParentCategory = this.currentParentCategory
  } else {
    // Root → add parent
    this.selectedParentCategory = null
  }

  this.CreateCategoryDilaog = true
    },

    OpenCreateChildCategory(item) {
      this.selectedParentCategory = item
      this.CreateCategoryDilaog = true
    },

    OpenUpdateCategoryDilaog(item) {
      this.selectedCategory = item
      this.updateDialog = true
    },

    OpenDeleteCategoryDilaog(item) {
      this.selectedCategory = item
      this.deleteDialog = true
    },

    async loadFromRoute() {
      this.overlay = true
      const parentId = this.$route.query.parentId || null
      await this.getCategoryListMethod(parentId)
      this.currentParentCategory =
        parentId
          ? this.categoryListArray.find(c => c.category_id === parentId) || null
          : null
      this.overlay = false
    },

    onRowClick(event, { item }) {
       if (this.$route.query.parentId) return
      this.$router.push({
        name: 'CategoryPage',
        query: { parentId: item.category_id ,parentName:item.category_name}
      })
    },
  }
}
</script>
