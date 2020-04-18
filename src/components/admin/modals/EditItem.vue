<template>
  <b-modal v-model="showModal" :id="`editItem-${item._id}`" :title="$t('datastructure.edit_item')" body-bg-variant="100" no-close-on-backdrop>
    <b-form class="my-3">
      <b-form-group id="name" :label="$t('form.name')" label-for="name-input">
        <b-form-input id="name-input" v-model="editItem.name" required />
      </b-form-group>
      <b-form-group id="identifier" :label="$t('datastructure.identifier')" label-for="identifier-input">
        <b-form-input id="identifier-input" v-model="editItem.identifier" required />
      </b-form-group>
      <b-form-group id="category" :label="$t('datastructure.category')" label-for="category-input">
        <el-select id="category-input" v-model="editItem.category" @change="categoryChange" :placeholder="$t('datastructure.category')" class="w-100" filterable>
          <el-option-group v-for="businessUnit in businessUnits" :key="businessUnit._id" :label="businessUnit.name">
            <el-option v-for="category in categoriesForBusinessUnit(businessUnit)" :key="category._id" :label="category.name" :value="category._id">
              <!-- <span style="display: inline-block; width: 10px; height: 10px;" :style="{ backgroundColor: category.color }"></span> -->
              <span>{{ category.name }}</span>
            </el-option>
          </el-option-group>
        </el-select>
      </b-form-group>
    </b-form>

    <div slot="modal-footer">
      <save-button :disabled="!validInput" :saving="saving" @click="updateItem()">{{ $t('form.save') }}</save-button>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
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
      this.editItem.vatRegime = this.categories.find(c => c._id === this.editItem.category).vatRegime
    },
  },
}
</script>
