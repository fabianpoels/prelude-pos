<template>
  <div>
    <b-button variant="warning" v-if="scannedTags > 0">
      <font-awesome-icon :icon="['fas', 'user']" size="2x" />
    </b-button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['scannedTags']),
  },
}
</script>
