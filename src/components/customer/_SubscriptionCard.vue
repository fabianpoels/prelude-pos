<template>
  <entrytoken-card :valid="isValid" :token="token" :customer="customer">
    <template v-slot:title>{{ tokenName }}</template>
    <template v-slot:no-collapse>
      <b-container>
        <b-row>
          <b-col>
            <b-row cols="7">
              <b-col>{{ $t('entrytoken.purchased_on') }} {{ purchasedOnFormatted }}</b-col>
              <b-col>{{ $t('entrytoken.valid_until') }} {{ validUntilFormatted }}</b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </template>
    <b-table :fields="fields" :items="tableItems" class="mt-4">
      <template #cell(index)="data">
        <span class="text-muted">{{ tableItems.length - data.index }}</span>
      </template>
      <template v-slot:cell(date)="data">{{ $helpers.formatDate(gym.settings, data.value) }}</template>
      <template v-slot:cell(time)="data">{{ $helpers.formatTime(gym.settings, data.value) }}</template>
    </b-table>
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

    fields() {
      return [
        { key: 'index', label: '' },
        { key: 'date', label: this.$i18n.t('entrytoken.entrances') },
        { key: 'time', label: '' },
        { key: 'action', label: '' },
      ]
    },

    tableItems() {
      return this.token.entrances.map(entrance => {
        let datetime = DateTime.fromJSDate(entrance)
        return {
          date: datetime,
          time: datetime,
        }
      })
    },

    isValid() {
      return this.validUntil >= DateTime.local().endOf('day') && DateTime.local() >= this.purchasedOn.startOf('day')
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
