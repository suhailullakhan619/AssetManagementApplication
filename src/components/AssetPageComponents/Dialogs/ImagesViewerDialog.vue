<template>
  <v-dialog :model-value="imageViewerDialog" persistent max-width="700">
    <v-card class="d-flex flex-column ">

      <v-toolbar color="primary">
        
        <v-spacer />

        <span class="text-white">
          {{ currentIndex + 1 }} / {{ images.length }}
        </span>
        <v-spacer />
          <v-icon size="32"  @click="imageViewerDialogclose()">mdi-close</v-icon>
      </v-toolbar>

      <v-card-text class="d-flex align-center justify-center position-relative " >
        <v-btn
          v-if="images.length > 1"
          icon
          @click="prev"
          color="primary"
            class="position-absolute"      
  style="opacity: 0.7;left: 10px;top: 50%; transform: translateY(-50%);z-index:10;"
        >
          <v-icon size="40"  color="white">mdi-chevron-left</v-icon>
        </v-btn>

        <v-img
          :src="images[currentIndex]"
          max-height="500"
          max-width="500"
          contain
        />

        <v-btn
          v-if="images.length > 1"
          icon
          color="primary"
          @click="next"
            class="position-absolute "
    style="opacity: 0.7;right: 10px;top: 50%; transform: translateY(-50%);z-index:10;"
        >
          <v-icon size="40" color="white">mdi-chevron-right</v-icon>
        </v-btn>

      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    imageViewerDialog: Boolean,
    images: Array,
    startIndex: Number
  },

  data() {
    return {
      currentIndex: this.startIndex || 0
    }
  },

  watch: {
     startIndex: {
    immediate: true,
    handler(val) {
      this.currentIndex = val || 0
    }
  },
  imageViewerDialog(val) {
    if (val) {
      this.currentIndex = this.startIndex || 0
    }
  }
},
emits:['update:imageViewerDialog'],
  methods: {
    imageViewerDialogclose(){
  this.$emit('update:imageViewerDialog',false)
    },
    next() {
      if (this.currentIndex < this.images.length - 1)
        this.currentIndex++
    },
    prev() {
      if (this.currentIndex > 0)
        this.currentIndex--
    }
  }
}
</script>