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
     v-if="currentCategoryId === null"
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
     v-if="currentCategoryId === null"
        color="primary"
        variant="flat"
        rounded="lg"
        class="d-none d-sm-flex"
        @click=" OpenCreateCategoryDilaog"
      >
        <v-icon start>mdi-plus</v-icon>
   Add Category
      </v-btn>

      <v-btn
  v-if="currentCategoryId !== null"
  class="d-flex d-sm-none"
  icon=""
  color="primary"
  variant="flat"
  rounded="circle"
  @click="OpenCreateChildCategory(currentParentCategory)"
>
  <v-icon>mdi-plus</v-icon>
</v-btn>
<v-btn
  v-if="currentCategoryId !== null"
  color="primary"
  variant="flat"
  rounded="lg"
  class="d-none d-sm-flex"
  @click="OpenCreateChildCategory(currentParentCategory)"
>
  <v-icon start>mdi-plus</v-icon>
  Add Sub Category
</v-btn>
    </v-toolbar>


    <!-- CATEGORY TABLE -->
    <v-card elevation="2" rounded="lg">
       <v-card-text  class="pa-2 d-flex justify-end">
        <v-breadcrumbs :items="breadcrumbs">
  <template #item="{ item }">
    <v-breadcrumbs-item
     :disabled="item.disabled"
  @click="item.action && item.action()"
      class="cursor-pointer"
    >
      {{ item.title }}
    </v-breadcrumbs-item>
  </template>
   <template #divider>
    <v-icon>mdi-chevron-right</v-icon>
  </template>
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
        :class="{'no-row-click':currentCategoryId!==null}"
        @click:row="onRowClick"
      >
       <template v-slot:[`item.category_status`]="{item}">
          <v-chip density="comfortable" :color="item.category_status==='ACTIVE'?'green':'red' ">{{ item.category_status }}</v-chip>
        </template>
<template v-slot:[`item.sub_count`]="{ item }">
  <v-chip 
    :color="getSubCategoryCount(item.category_id) > 0 ? 'green' : 'grey'"
    density="comfortable"
  >
    {{ getSubCategoryCount(item.category_id) }}
  </v-chip>
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
              <v-list-item v-if="!$route.params.parentId" @click="OpenCreateChildCategory(item)">
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
import CreateCategoryDilaog from '@/components/CategoryComponents/Dialogs/CreateCategoryDilaog.vue'
import OverlayComp from '@/components/Extras/OverlayComp.vue'
import UpdateCategoryDialog from '@/components/CategoryComponents/Dialogs/UpdateCategoryDialog.vue'
import { categoryList } from '@/mixins/Category/CategoryList'
import DeleteCategoryDilaog from '@/components/CategoryComponents/Dialogs/DeleteCategoryDilaog.vue'

export default {
  components: {
    CreateCategoryDilaog,
    OverlayComp,
    UpdateCategoryDialog,
    DeleteCategoryDilaog,
  },

  mixins: [categoryList],

  data() {
    return {
      allCategoriesArray: [],
      currentCategoryId: null,
      breadcrumbStack: [],

      currentParentCategory: null,
      selectedParentCategory: null,
      selectedCategory: {},

      CreateCategoryDilaog: false,
      updateDialog: false,
      deleteDialog: false,

      overlay: false,
      search: '',
      tableHeight: 0, 
    }
  },

  mounted() {
    this.tableHeight = window.innerHeight - 350
    this.loadFromRoute()
  },

  computed: {
    mdAndUp() {
      return this.$vuetify.display.mdAndUp
    },
     headers(){
      const tableTitle=[
        { title: 'Category Name', key: 'category_name' },
        { title: 'Category Status', key: 'category_status' },
        { title: 'Category Type', key: 'category_type' },
        { title: 'Actions', key: 'actions' },
      ]
        if (this.currentCategoryId === null) {
      tableTitle.splice(3, 0, { title: 'Sub-Category Count', key: 'sub_count' })
    }
      return tableTitle
    },
    // ✅ Breadcrumbs driven by local state (NO ROUTER)
    breadcrumbs() {
      const crumbs = [
        {
          title: 'Categories',
          disabled: this.currentCategoryId === null,
          action: () => {
            this.currentCategoryId = null
            this.breadcrumbStack = []
            this.loadFromRoute()
          },
        },
      ]

      this.breadcrumbStack.forEach((cat, index) => {
        crumbs.push({
          title: cat.category_name,
          disabled: index === this.breadcrumbStack.length - 1,
          action: () => {
            this.breadcrumbStack = this.breadcrumbStack.slice(0, index + 1)
            this.currentCategoryId = cat.category_id
            this.loadFromRoute()
          },
        })
      })

      return crumbs
    },
  },

  watch: {
    '$vuetify.display.height'(val) {
      this.tableHeight = val - 280
    },
  },

  methods: {
    getSubCategoryCount(parentId) {
  if (!Array.isArray(this.allCategoriesArray)) return 0
  return this.allCategoriesArray.filter(
    c => c.parent_category_id === parentId
  ).length
},
    OpenCreateCategoryDilaog() {
      this.selectedParentCategory = this.currentParentCategory
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

      await this.getCategoryListMethod(this.currentCategoryId)
       if (this.currentCategoryId === null) {
    this.allCategoriesArray = [...this.categoryListArray]
  }

       if (this.currentCategoryId !== null) {
    this.currentParentCategory = this.breadcrumbStack[this.breadcrumbStack.length - 1] || null
  } else {
    this.currentParentCategory = null
  }

      this.overlay = false
    },

    onRowClick(event, { item }) {
  if (this.currentCategoryId !== null) return

  this.breadcrumbStack.push(item)
  this.currentCategoryId = item.category_id
  this.loadFromRoute()
    },
  },
}
</script>

<style scoped>
.no-row-click tbody tr{
cursor:default;
}
</style>