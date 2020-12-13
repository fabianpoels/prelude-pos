<template>
  <entrytoken-card :valid="isValid" :token="token" :customer="customer">
    <template v-slot:title>{{ tokenName }}</template>
    <template v-slot:no-collapse>
      <b-container>
        <b-row>
          <b-col>
            <b-row cols="7">
              <b-col>{{ $t('entrytoken.purchased_on') }} {{ purchasedOnFormatted }}</b-col>
              <b-col v-if="token.validUntil && token.validUntil !== null">
                {{ $t('entrytoken.valid_until') }} {{ validUntilFormatted }}<b-badge pill class="ml-2" variant="warning" v-if="showValidWarning">!</b-badge>
              </b-col>
              <b-col>{{ $t('entrytoken.entries_left') }}: {{ entriesLeft }}<b-badge pill class="ml-2" variant="warning" v-if="entriesLeft < 2">!</b-badge></b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </template>
    <b-table-simple class="mt-4">
      <b-thead>
        <b-th colspan="3">
          <span>{{ $t('entrytoken.entrances') }}</span>
        </b-th>
        <b-th class="centered">
          <span :class="[addingEntry ? 'text-muted' : 'text-primary']" v-if="entriesLeft > 0">
            <font-awesome-icon :class="{ 'add-icon': !addingEntry }" @click="addingEntry = true" :icon="['fas', 'plus']" />
          </span>
        </b-th>
      </b-thead>
      <b-tbody>
        <b-tr v-if="addingEntry">
          <b-td>
            <span class="text-muted">{{ token.entrances.length + 1 }}</span>
          </b-td>
          <b-td colspan="3" class="centered">
            <el-date-picker type="datetime" v-model="newEntryDate" />
            <save-button size="sm" class="ml-2" :saving="busy" @click="addEntry()">{{ $t('form.save') }}</save-button>
            <b-btn size="sm" class="ml-2" variant="outline-secondary" @click="addingEntry = false">{{ $t('form.cancel') }}</b-btn>
          </b-td>
        </b-tr>
        <punchcard-entry-row v-for="(entrance, index) in token.entrances" :entrance="entrance" :number="token.entrances.length - index" :key="`${token.id}-${entrance.toString()}`" @delete="deleteEntry(index)" />
      </b-tbody>
    </b-table-simple>
  </entrytoken-card>
</template>
<script>
import { mapGetters } from 'vuex'
import { DateTime } from 'luxon'
import EntrytokenCard from '@/components/customer/EntrytokenCard'
import PunchcardEntryRow from '@/components/customer/_PunchcardEntryRow'
import SaveButton from '@/components/shared/SaveButton'
import config from '@/config/config'
export default {
  components: {
    EntrytokenCard,
    PunchcardEntryRow,
    SaveButton,
  },

  computed: {
    ...mapGetters(['gym']),

    entriesLeft() {
      return this.token.item.punchcardEntries - this.token.entrances.length
    },

    isValid() {
      if (this.token.validUntil && this.token.validUntil !== null) {
        return this.validUntil >= DateTime.local().endOf('day') && this.purchasedOn.startOf('day') <= DateTime.local() && this.entriesLeft > 0
      }
      return this.purchasedOn.startOf('day') <= DateTime.local() && this.entriesLeft > 0
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

    showEntriesLeftWarning() {
      return this.entriesLeft < config.entrytokens.warning.entriesLeft
    },

    showValidWarning() {
      return this.isValid && DateTime.local() > this.validUntil.minus({ weeks: config.entrytokens.warnings.weeksLeft })
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
      addingEntry: false,
      expanded: false,
      busy: false,
      newEntryDate: DateTime.local().toJSDate(),
    }
  },

  methods: {
    async addEntry() {
      this.busy = true
      await this.$store.dispatch('registerEntry', { customer: this.customer, token: this.token, date: this.newEntryDate })
      let item = this.token.item
      let price = this.token.price
      let text = `${item.name}${price.name !== null && price.name !== '' ? `: ${price.name}` : ''} - ${this.customer.firstname} ${this.customer.lastname}`
      this.$bvToast.toast(text, {
        title: this.$i18n.t('entrytoken.entry_registered'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
      this.addingEntry = false
      this.busy = false
      this.newEntryDate = DateTime.local().toJSDate()
    },

    async deleteEntry(index) {
      this.busy = true
      await this.$store.dispatch('deleteEntry', { customer: this.customer, token: this.token, index: index })
      this.busy = false
      // let customerCopy = { ...this.customer }
      // let tokenCopy = { ...this.token }
      // tokenCopy.entrances.splice(index)
      // customerCopy.entryTokens.splice(
      //   customerCopy.entryTokens.findIndex(t => t.id === tokenCopy.id),
      //   1,
      //   tokenCopy.entrances
      // )
    },
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
<style scoped>
.add-icon {
  cursor: pointer;
}
</style>
