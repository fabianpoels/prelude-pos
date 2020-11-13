<template>
  <entrytoken-card :valid="isValid" :token="token" :customer="customer">
    <template v-slot:title>{{ tokenName }}</template>
    <template v-slot:title-info>{{ $t('entrytoken.valid_on') }} {{ validUntilFormatted }}</template>
  </entrytoken-card>
</template>
<script>
import { mapGetters } from 'vuex'
import { DateTime } from 'luxon'
import EntrytokenCard from '@/components/customer/EntrytokenCard'
export default {
  components: {
    EntrytokenCard,
  },

  computed: {
    ...mapGetters(['gym']),

    isValid() {
      return DateTime.local().hasSame(this.validUntil, 'day')
    },

    tokenName() {
      if (this.token.price.name && this.token.price.name !== null && this.token.price.name !== '') {
        return `${this.token.item.name}: ${this.token.price.name}`
      }
      return this.token.item.name
    },

    validUntil() {
      return DateTime.fromJSDate(this.token.validUntil)
    },

    validUntilFormatted() {
      return this.$helpers.formatDate(this.gym.settings, DateTime.fromJSDate(this.token.validUntil))
    },
  },

  data() {
    return {
      expanded: false,
    }
  },

  props: {
    customer: {
      type: Object,
      required: true,
    },
    token: {
      type: Object,
      required: true,
    },
  },
}
</script>
