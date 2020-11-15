<template>
  <b-modal v-model="showModal" id="addItemModal" :title="$t('datastructure.add_item')" body-bg-variant="100" no-close-on-backdrop>
    <b-form class="my-3">
      <b-form-group id="name" :label="$t('form.name')" label-for="name-input">
        <b-form-input id="name-input" v-model="newItem.name" required />
      </b-form-group>
      <b-form-group id="identifier" :label="$t('datastructure.identifier')" label-for="identifier-input">
        <b-form-input id="identifier-input" v-model="newItem.identifier" required />
      </b-form-group>
      <b-form-group id="category" :label="$t('datastructure.category')" label-for="category-input">
        <el-select id="category-input" v-model="newItem.category" :placeholder="$t('datastructure.category')" class="w-100" filterable>
          <el-option-group v-for="businessUnit in businessUnits" :key="businessUnit._id" :label="businessUnit.name">
            <el-option v-for="category in categoriesForBusinessUnit(businessUnit)" :key="category._id" :label="category.name" :value="category._id">
              <span class="category-dot" :style="{ backgroundColor: category.color }"></span>
              <span class="ml-2">{{ category.name }}</span>
            </el-option>
          </el-option-group>
        </el-select>
      </b-form-group>
      <price-items v-model="prices" :item="newItem" />
      <b-form-group id="isEntryToken" label-for="isEntryToken-input" class="mt-4">
        <b-form-checkbox v-model="newItem.isEntryToken" name="isEntryToken-input" switch>{{ $t('datastructure.is_entry_token') }}</b-form-checkbox>
      </b-form-group>
      <template v-if="newItem.isEntryToken">
        <b-form-group :label="`${$t('datastructure.type')}`" label-for="tokenType">
          <b-form-select v-model="newItem.tokenType" :options="tokenTypeOptions" :disabled="saving" />
        </b-form-group>
        <template v-if="newItem.tokenType === 'punchcard'">
          <b-form-group id="punchcard-entries" :label="$t('datastructure.entries')" label-for="punchcard-entries-input">
            <b-input-group :append="punchcardEntriesAppend.toLowerCase()">
              <b-form-input id="punchcard-entries-input" :number="true" type="number" :min="1" :step="1" v-model="newItem.punchcardEntries" />
            </b-input-group>
          </b-form-group>
          <b-form-group id="subscription-duration" :label="$t('datastructure.validity_period')" label-for="subscription-duration-input">
            <b-input-group :append="subscriptionDurationAppend.toLowerCase()">
              <b-form-input id="subscription-duration-input" :number="true" type="number" :min="0" :step="1" v-model="newItem.subscriptionDuration" />
            </b-input-group>
          </b-form-group>
        </template>
        <b-form-group id="subscription-duration" :label="$t('datastructure.subscription_duration')" label-for="subscription-duration-input" v-if="newItem.tokenType === 'subscription'">
          <b-input-group :append="subscriptionDurationAppend.toLowerCase()">
            <b-form-input id="subscription-duration-input" :number="true" type="number" :min="1" :step="1" v-model="newItem.subscriptionDuration" />
          </b-input-group>
        </b-form-group>
      </template>
    </b-form>

    <div slot="modal-footer">
      <save-button :disabled="!validInput" :saving="saving" @click="createItem()">{{ $t('form.save') }}</save-button>
    </div>
  </b-modal>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import PriceItems from '@/components/admin/modals/_PriceItems'
import SaveButton from '@/components/shared/SaveButton'
import config from '@/config/config'
export default {
  data: function() {
    return {
      showModal: false,
      saving: false,
      newItem: {},
      prices: [],
    }
  },

  components: {
    PriceItems,
    SaveButton,
  },

  watch: {
    showModal(value) {
      if (value) {
        this.newItem = this.blankItem()
        this.prices = []
      }
    },

    isEntryToken(value) {
      if (value === true) {
        Vue.set(this.newItem, 'tokenType', config.tokenTypes[0])
      } else {
        Vue.delete(this.newItem, 'tokenType')
      }
    },
  },

  computed: {
    ...mapGetters(['businessUnits', 'categoriesForBusinessUnit', 'categories', 'vatFormOptions', 'tokenTypeOptioins']),

    validInput() {
      return this.newItem.name && this.newItem.name.length > 0 && this.newItem.category !== null && this.prices.length > 0
    },

    tokenTypeOptions() {
      return config.tokenTypes.map(tokenType => {
        return {
          value: tokenType,
          text: this.$i18n.t(`datastructure.tokenTypes.${tokenType}`),
        }
      })
    },

    subscriptionDurationAppend() {
      return this.newItem.subscriptionDuration === 1 ? this.$i18n.t('datastructure.month') : this.$i18n.t('datastructure.months')
    },

    punchcardEntriesAppend() {
      return this.newItem.punchcardEntries === 1 ? this.$i18n.t('datastructure.entry') : this.$i18n.t('datastructure.entries')
    },
  },

  methods: {
    blankItem() {
      return {
        name: '',
        identifier: '',
        vatRegime: this.vatFormOptions[0].value,
        category: null,
        salesPrice: 0,
        isEntryToken: false,
        subscriptionDuration: 3,
        punchcardEntries: 10,
      }
    },

    async createItem() {
      this.saving = true
      await this.$store.dispatch('createItem', { data: { ...this.newItem }, prices: this.prices })
      this.$bvToast.toast(`${this.newItem.name}`, {
        title: this.$i18n.t('forms.item.item_added'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
      this.saving = false
      this.showModal = false
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
