<template>
  <v-container style="height: 100vh">
    <v-empty-state
  headline="Whoops, 404"
  title="Page not found"
  text="The page you were looking for does not exist"
>
  <template #media>
    <img
      src="/assetLogo.svg"
      alt="Asset Logo"
      style="max-width: 180px"
      class="mb-6"
    />
  </template>

  <v-btn
    color="primary"
    elevation="0"
    style="text-transform: none; margin-top: 16px"
    @click="routingBasedOnThePageNotFound"
  >
    Go Back
  </v-btn>
</v-empty-state>
       
  </v-container>
</template>

<script>
import { getCurrentUser } from '@/mixins/GetCurrentUser/getCurrentUser';
export default {
  data() {
    return {};
  },
  mixins: [getCurrentUser],
  methods: {
    async routingBasedOnThePageNotFound() {
      try{
      await this.getCurrentUserMethod();
    if (this?.getCurrentUserDetails.role_id==='SUPER_ADMIN') {
      this.$router.push("/Admin")
    } else if(this?.getCurrentUserDetails.role_id==='ORG_OWNER'){
      this.$router.push('/Users')
    } else if(this?.getCurrentUserDetails.role_id==='ORG_USER'){
      this.$router.push('/UserProfile')
    } else {
      this.$router.push("/")
    }
  }catch(e){
    this.$router.push('/')
  }
    },
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser;
    },
  },
};
</script>
