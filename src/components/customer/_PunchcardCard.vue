<template>
  <entrytoken-card :valid="entriesLeft > 0">
    <template v-slot:title>{{ tokenName }}</template>
    <template v-slot:title-info>{{ $t('entrytoken.entries_left') }}: {{ entriesLeft }}</template>
  </entrytoken-card>
</template>
<script>
import { mapGetters } from 'vuex'
import EntrytokenCard from '@/components/customer/EntrytokenCard'
export default {
  components: {
    EntrytokenCard,
  },

  computed: {
    ...mapGetters(['gym']),

    entriesLeft() {
      return this.token.item.punchcardEntries - this.token.entrances.length
    },

    tokenName() {
      if (this.token.price.name && this.token.price.name !== null && this.token.price.name !== '') {
        return `${this.token.item.name}: ${this.token.price.name}`
      }
      return this.token.item.name
    },
  },

  data() {
    return {
      expanded: false,
    }
  },

  props: {
    token: {
      type: Object,
      required: true,
    },
  },
}
</script>
