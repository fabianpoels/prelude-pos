<template>
  <b-modal v-model="showModal" :id="`editItem-${item.id}`" :title="$t('datastructure.edit_item')" body-bg-variant="100" no-close-on-backdrop>
    <b-form class="my-3">
      <b-form-group id="name" :label="$t('form.name')" label-for="name-input">
        <b-form-input id="name-input" v-model="editItem.name" required />
      </b-form-group>
      <b-form-group id="identifier" :label="$t('datastructure.identifier')" label-for="identifier-input">
        <b-form-input id="identifier-input" v-model="editItem.identifier" required />
      </b-form-group>
      <b-form-group id="category" :label="$t('datastructure.category')" label-for="category-input">
        <el-select id="category-input" v-model="editItem.category" @change="categoryChange" :placeholder="$t('datastructure.category')" class="w-100" filterable>
          <el-option-group v-for="businessUnit in businessUnits" :key="businessUnit.id" :label="businessUnit.name">
            <el-option v-for="category in categoriesForBusinessUnit(businessUnit)" :key="category.id" :label="category.name" :value="category.id">
              <span class="category-dot" :style="{ backgroundColor: category.color }"></span>
              <span class="ml-2">{{ category.name }}</span>
            </el-option>
          </el-option-group>
        </el-select>
      </b-form-group>
      <b-form-group id="isEntryToken" label-for="isEntryToken-input" class="mt-4">
        <b-form-checkbox v-model="editItem.isEntryToken" name="isEntryToken-input" switch>{{ $t('datastructure.is_entry_token') }}</b-form-checkbox>
      </b-form-group>
      <template v-if="editItem.isEntryToken">
        <b-form-group :label="`${$t('datastructure.type')}`" label-for="tokenType">
          <b-form-select v-model="editItem.tokenType" :options="tokenTypeOptions" :disabled="saving" />
        </b-form-group>
        <template v-if="editItem.tokenType === 'punchcard'">
          <b-form-group id="punchcard-entries" :label="$t('datastructure.entries')" label-for="punchcard-entries-input">
            <b-input-group :append="punchcardEntriesAppend.toLowerCase()">
              <b-form-input id="punchcard-entries-input" :number="true" type="number" :min="1" :step="1" v-model="editItem.punchcardEntries" />
            </b-input-group>
          </b-form-group>
          <b-form-group id="subscription-duration" :label="$t('datastructure.validity_period')" label-for="subscription-duration-input">
            <b-input-group :append="subscriptionDurationAppend.toLowerCase()">
              <b-form-input id="subscription-duration-input" :number="true" type="number" :min="0" :step="1" v-model="editItem.subscriptionDuration" />
            </b-input-group>
          </b-form-group>
        </template>
        <b-form-group id="subscription-duration" :label="$t('datastructure.subscription_duration')" label-for="subscription-duration-input" v-if="editItem.tokenType === 'subscription'">
          <b-input-group :append="subscriptionDurationAppend.toLowerCase()">
            <b-form-input id="subscription-duration-input" :number="true" type="number" :min="1" :step="1" v-model="editItem.subscriptionDuration" />
          </b-input-group>
        </b-form-group>
      </template>
    </b-form>
    <div slot="modal-footer">
      <save-button :disabled="!validInput" :saving="saving" @click="updateItem()">{{ $t('form.save') }}</save-button>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import config from '@/config/config'
import SaveButton from '@/components/shared/SaveButton'
export default {
  data: function() {
    return {
      showModal: false,
      saving: false,
      editItem: {},
    }
  },

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  components: {
    SaveButton,
  },

  watch: {
    showModal(value) {
      if (value) {
        this.editItem = { ...this.item }
      }
    },
  },

  computed: {
    ...mapGetters(['businessUnits', 'categoriesForBusinessUnit', 'categories', 'gym', 'vatFormOptions']),

    tokenTypeOptions() {
      return config.tokenTypes.map(tokenType => {
        return {
          value: tokenType,
          text: this.$i18n.t(`datastructure.tokenTypes.${tokenType}`),
        }
      })
    },

    subscriptionDurationAppend() {
      return this.editItem.subscriptionDuration === 1 ? this.$i18n.t('datastructure.month') : this.$i18n.t('datastructure.months')
    },

    punchcardEntriesAppend() {
      return this.editItem.punchcardEntries === 1 ? this.$i18n.t('datastructure.entry') : this.$i18n.t('datastructure.entries')
    },

    validInput() {
      return this.editItem.name && this.editItem.name.length > 0 && this.editItem.category !== null
    },
  },

  methods: {
    async updateItem() {
      this.saving = true
      await this.$store.dispatch('updateItem', this.editItem)
      this.$bvToast.toast(`${this.editItem.name}`, {
        title: this.$i18n.t('forms.item.item_saved'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
      this.saving = false
      this.showModal = false
    },

    categoryChange() {
      this.editItem.vatRegime = this.categories.find(c => c.id === this.editItem.category.toString()).vatRegime
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
