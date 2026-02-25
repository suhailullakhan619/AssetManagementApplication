<template>
  <v-dialog :model-value="GlobalSearchDialogEmit" max-width="600" transition="dialog-top-transition" @click:outside="$emit('update:GlobalSearchDialogEmit',false)" @keydown.esc='closeDialog'>
    <v-card rounded="lg">
        <v-text-field
       v-model="searchQuery"
          placeholder="Search pages..."
          prepend-inner-icon="mdi-magnify"
          density="comfortable"
          autofocus
          clearable
          hide-details
          append-inner-icon="mdi-close"
    >
  <template #append-inner>
    <v-btn elevation="0" density="comfortable" class="border-sm"  style="color: grey; background-color: transparent;" @click="closeDialog" >ESC</v-btn>
  </template>
  </v-text-field>
       

      <v-divider color="primary" />
      <v-container  v-if="filteredRoutes.length">
    <v-list density="compact" class="border-sm rounded-lg" nav>
  <v-list-item
    v-for="(item, index) in filteredRoutes"
    :key="index"
    :title="item.title"
    @click="navigate(item.path)"
    :prepend-icon="item.icon"
    class="navigationlistitem"
  />
</v-list>
</v-container>
      <v-empty-state
        v-else
        title="No results"
        text="Try a different keyword"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import AdminRouterList from '@/JsonFiles/AdminRouterList.json'
import OrgnizationRouterList from '@/JsonFiles/OrganisationRouterList.json';
import UserProfileUpdateList from '@/JsonFiles/UserProfileRouterList.json'
export default {
  props: {
    GlobalSearchDialogEmit: Boolean,
    role: {
    type: String,
    required: true
  }
  },
  emits: ['update:GlobalSearchDialogEmit'],
  data() {
    return {
      searchQuery: '',
      globalRoutes: [
        { title: 'Dashboard', path: '/Admin', icon: 'mdi-view-dashboard' },
        { title: 'Assets', path: '/Assets', icon: 'mdi-cube-outline' },
        { title: 'Categories', path: '/CategoryPage', icon: 'mdi-palette-swatch-outline' },
        { title: 'Users', path: '/Users', icon: 'mdi-account-group' },
        { title: 'Profile', path: '/UserProfile', icon: 'mdi-account' }
      ],
      AdminRouterList,
      OrgnizationRouterList,
      UserProfileUpdateList
    }
  },
  computed: {
  roleRoutes() {
    if (this.role === 'SUPER_ADMIN') return this.AdminRouterList
    if (this.role === 'ORG_OWNER') return this.OrgnizationRouterList
    if (this.role === 'ORG_USER') return this.UserProfileUpdateList
    return []
  },

  filteredRoutes() {
    if (!this.searchQuery) return this.roleRoutes
    return this.roleRoutes.filter(item =>
      item.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    )
  }
},
  methods:{
    closeDialog() {
    this.$emit('update:GlobalSearchDialogEmit', false)
  },

    navigate(path) {
      this.$emit('update:GlobalSearchDialogEmit', false)
      this.$router.push(path)
    }
  }
}
</script>