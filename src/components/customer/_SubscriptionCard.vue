<template>
  <entrytoken-card :valid="isValid" :token="token" :customer="customer">
    <template v-slot:title>{{ tokenName }}</template>
    <b-container>
      <b-row>
        <b-col>
          <b-row>
            <b-col>{{ $t('entrytoken.purchased_on') }}</b-col>
            <b-col>{{ purchasedOnFormatted }}</b-col>
          </b-row>
          <b-row>
            <b-col>{{ $t('entrytoken.valid_until') }}</b-col>
            <b-col>{{ validUntilFormatted }}</b-col>
          </b-row>
        </b-col>
        <b-col>
          <b-table></b-table>
        </b-col>
      </b-row>
    </b-container>
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
      return this.validUntil >= DateTime.local().endOf('day')
    },

    tokenName() {
      if (this.token.price.name && this.token.price.name !== null && this.token.price.name !== '') {
        return `${this.token.item.name}: ${this.token.price.name}`
      }
      return this.token.item.name
    },

    purchasedOn() {
      return DateTime.fromJSDate(this.token.purchasedAt)
    },

    purchasedOnFormatted() {
      return this.$helpers.formatDate(this.gym.settings, this.purchasedOn)
    },

    validUntil() {
      return DateTime.fromJSDate(this.token.validUntil)
    },

    validUntilFormatted() {
      return this.$helpers.formatDate(this.gym.settings, this.validUntil)
    },
  },

  data() {
    return {
      registering: false,
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
