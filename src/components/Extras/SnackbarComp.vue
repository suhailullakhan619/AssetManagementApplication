<template>

  <v-snackbar :model-value="snackbarComponent.snackBarModel" :color="snackbarComponent.color" location="top"
    timeout="3000">
    {{ snackbarComponent.message }}

  </v-snackbar>


</template>
<script>

export default {

  props: {
    snackbarComponent: Object
  },


  data() {
    return {

    }
  },
}

</script>