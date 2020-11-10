<template>
  <b-modal size="lg" v-model="showModal" :id="`viewCustomer-${customer._id}-${modalIdSuffix}`" :title="`${customer.firstname} ${customer.lastname}`" body-bg-variant="100" no-close-on-backdrop>
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
    <hr />
    <b-row>
      <b-col cols="12" lg="6">
        <entry-token-card v-for="(token, index) in customer.entryTokens" :token="token" :key="`${customer._id}-token-${index}`" />
      </b-col>
    </b-row>
    <div slot="modal-footer">
      <b-form class="my-3" inline>
        <b-form-group id="new-entry-token" label-for="new-entry-token-input">
          <el-select id="new-entry-token-input" v-model="newEntryTokenItem" :placeholder="$t('datastructure.entry_token')" class="w-100" filterable :disabled="saving">
            <template v-for="item in entryTokenItems">
              <template v-if="pricesForItem(item).length > 1">
                <el-option v-for="price in pricesForItem(item)" :key="price._id" :label="`${item.name}: ${price.name}`" :value="price._id">
                  <span class="category-dot" :style="{ backgroundColor: categoryById(item.category).color }"></span>
                  <span class="ml-2">{{ item.name }}: {{ price.name }}</span>
                </el-option>
              </template>
              <el-option v-else :key="item._id" :label="item.name" :value="pricesForItem(item)[0]._id">
                <span class="category-dot" :style="{ backgroundColor: categoryById(item.category).color }"></span>
                <span class="ml-2">{{ item.name }}</span>
              </el-option>
            </template>
          </el-select>
        </b-form-group>
        <save-button :disabled="newEntryTokenItem === null" :saving="saving" @click="addEntryTokenItem()" class="ml-2" :savingText="$t('form.adding')">{{ $t('form.add') }}</save-button>
      </b-form>
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from 'vuex'
import EntryTokenCard from '@/components/customer/EntryTokenCard'
import SaveButton from '@/components/shared/SaveButton'
export default {
  components: {
    EntryTokenCard,
    SaveButton,
  },

  computed: {
    ...mapGetters(['entryTokenItems', 'categoryById', 'pricesForItem']),
  },

  data() {
    return {
      newEntryTokenItem: null,
      saving: false,
      showModal: false,
    }
  },

  methods: {
    addEntryTokenItem() {
      this.saving = true
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
    showModal(show) {
      if (show) this.newEntryTokenItem = null
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
