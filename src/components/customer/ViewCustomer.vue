<template>
  <b-modal size="lg" scrollable v-model="showModal" :id="`viewCustomer-${customer.id}-${modalIdSuffix}`" :title="`${customer.firstname} ${customer.lastname}`" body-bg-variant="100" @hidden="$emit('hidden')">
    <b-row>
      <b-col cols="12" lg="6">
        <div><font-awesome-icon :icon="['fas', 'user']" /> {{ customer.firstname }} {{ customer.lastname }}</div>
        <div v-if="customer.email && customer.email !== null"><font-awesome-icon :icon="['fas', 'envelope']" /> {{ customer.email }}</div>
        <div v-if="customer.phone && customer.phone !== null"><font-awesome-icon :icon="['fas', 'phone']" /> {{ customer.phone }}</div>
        <template v-if="customer.address">
          <div><font-awesome-icon :icon="['fas', 'map-marked-alt']" /> {{ customer.address.street }}, {{ customer.address.zipCode }} {{ customer.address.town }} ({{ customer.address.country }})</div>
        </template>
      </b-col>
      <b-col cols="12" lg="6">
        <!-- PLACEHOLDER FOR PICTURE  -->
      </b-col>
    </b-row>
    <b-tabs class="mt-4">
      <!-- ENTRY TOKENS -->
      <b-tab :title="$t('datastructure.entry_tokens')" class="pt-2">
        <b-form class="my-3" inline>
          <b-form-group id="new-entry-token" label-for="new-entry-token-input">
            <el-select id="new-entry-token-input" v-model="newEntryTokenPriceId" :placeholder="$t('datastructure.entry_token')" class="w-100" filterable :disabled="saving">
              <template v-for="item in entryTokenItems">
                <template v-if="pricesForItem(item).length > 1">
                  <el-option v-for="price in pricesForItem(item)" :key="price.id" :label="`${item.name}: ${price.name}`" :value="price.id">
                    <span class="category-dot" :style="{ backgroundColor: categoryById(item.category.toString()).color }"></span>
                    <span class="ml-2">{{ item.name }}: {{ price.name }}</span>
                  </el-option>
                </template>
                <el-option v-else-if="pricesForItem(item).length === 1" :key="item.id" :label="item.name" :value="pricesForItem(item)[0].id">
                  <span class="category-dot" :style="{ backgroundColor: categoryById(item.category.toString()).color }"></span>
                  <span class="ml-2">{{ item.name }}</span>
                </el-option>
              </template>
            </el-select>
          </b-form-group>
          <save-button :disabled="newEntryTokenPriceId === null" :saving="saving" @click="addEntryToken()" class="ml-2" :savingText="$t('form.adding')">{{ $t('form.add') }}</save-button>
        </b-form>
        <b-row>
          <b-col cols="12" lg="12">
            <template v-for="token in customer.entryTokens">
              <punchcard-card :token="token" :customer="customer" v-if="token.item.tokenType === 'punchcard'" :key="`${customer.id}-token-${token.id}`" />
              <subscription-card :token="token" :customer="customer" v-else-if="token.item.tokenType === 'subscription'" :key="`${customer.id}-token-${token.id}`" />
              <single-entry-card :token="token" :customer="customer" v-else-if="token.item.tokenType === 'single'" :key="`${customer.id}-token-${token.id}`" />
            </template>
          </b-col>
        </b-row>
      </b-tab>
      <!-- COMMENTS -->
      <comments-tab :customer="customer" />
      <!-- TAGS -->
      <b-tab class="pt-4">
        <template #title>{{ $t('customer.tags') }}<b-spinner v-if="loadingTags" class="ml-2" small/></template>
        <customer-tags :tags="customerTags" :customer="customer" @reload="loadTags()" />
      </b-tab>
    </b-tabs>
    <div slot="modal-footer"></div>
  </b-modal>
</template>
<script>
import { mapGetters } from 'vuex'
import CommentsTab from '@/components/customer/_CommentsTab'
import CustomerTags from '@/components/customer/_CustomerTags'
import PunchcardCard from '@/components/customer/_PunchcardCard'
import SaveButton from '@/components/shared/SaveButton'
import SingleEntryCard from '@/components/customer/_SingleEntryCard'
import SubscriptionCard from '@/components/customer/_SubscriptionCard'
export default {
  components: {
    CommentsTab,
    CustomerTags,
    PunchcardCard,
    SaveButton,
    SingleEntryCard,
    SubscriptionCard,
  },

  computed: {
    ...mapGetters(['entryTokenItems', 'categoryById', 'pricesForItem', 'priceById', 'isAdmin']),
  },

  data() {
    return {
      customerTags: [],
      loadingTags: false,
      newEntryTokenPriceId: null,
      saving: false,
      showModal: false,
    }
  },

  methods: {
    async addEntryToken() {
      this.saving = true
      let price = this.priceById(this.newEntryTokenPriceId)
      let item = this.entryTokenItems.find(i => i.id === price.item.toString())
      let name = `${item.name}${price.name !== null && price.name !== '' ? `: ${price.name}` : ''}`
      await this.$store.dispatch('addEntryTokenItemToCustomer', { customer: this.customer, price: price, item: item })
      this.$store.commit('addToCart', price.id)
      this.$bvToast.toast(name, {
        title: this.$i18n.t('entrytoken.entry_token_added'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
      this.saving = false
    },

    async loadTags() {
      if (this.customer && this.customer !== null) {
        this.loadingTags = true
        this.customerTags = await this.$store.dispatch('loadTagsForCustomer', this.customer)
        this.loadingTags = false
      } else {
        this.customerTags = []
      }
    },
  },

  props: {
    customer: {
      type: Object,
      required: true,
    },
    modalIdSuffix: {
      type: String,
      required: false,
      default: '',
    },
  },

  watch: {
    async showModal(show) {
      if (show) this.newEntryTokenPriceId = null
      this.loadTags()
    },
  },
}
</script>
<style scoped>
.category-dot {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-collapse: collapse;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  box-sizing: content-box;
  display: inline-block;
  height: 10px;
  width: 10px;
}
</style>
