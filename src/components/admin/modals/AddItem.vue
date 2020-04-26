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
    </b-form>

    <div slot="modal-footer">
      <save-button :disabled="!validInput" :saving="saving" @click="createItem()">{{ $t('form.save') }}</save-button>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import PriceItems from '@/components/admin/modals/_PriceItems'
import SaveButton from '@/components/shared/SaveButton'
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
  },

  computed: {
    ...mapGetters(['businessUnits', 'categoriesForBusinessUnit', 'categories', 'vatFormOptions']),

    validInput() {
      return this.newItem.name && this.newItem.name.length > 0 && this.newItem.category !== null && this.prices.length > 0
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
