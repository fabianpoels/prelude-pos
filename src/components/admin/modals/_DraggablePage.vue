<template>
  <div class="bg-white rounded border d-flex p-2 mb-2 draggable">
    <div class="mr-3">
      <font-awesome-icon :icon="['fas', 'grip-lines']" />
    </div>
    <div class="mr-3">
      <font-awesome-icon :icon="['fas', page.icon]" v-if="page.icon" />
    </div>
    <div class="mr-3">
      <div>{{ page.name }}</div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    pageId: {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapGetters(['pageById']),

    page() {
      return this.pageById(this.pageId)
    },
  },
}
</script>
<style scoped>
.draggable {
  cursor: grab;
}
</style>
