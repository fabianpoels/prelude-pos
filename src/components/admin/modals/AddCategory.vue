<template>
  <b-modal v-model="showModal" :id="`addCategoryModal-${businessUnit.id}`" :title="$t('datastructure.add_category')" body-bg-variant="100" no-close-on-backdrop>
    <b-form class="my-3">
      <b-form-group id="name" :label="$t('form.name')" label-for="name-input">
        <b-form-input id="name-input" v-model="newCategory.name" required />
      </b-form-group>
      <b-form-group id="identifier" :label="$t('datastructure.identifier')" label-for="identifier-input">
        <b-form-input id="identifier-input" v-model="newCategory.identifier" required />
      </b-form-group>
      <b-form-group id="vatRegime" :label="$t('datastructure.vat_regime')" label-for="vatRegime-input">
        <b-form-select v-model="newCategory.vatRegime" :options="vatFormOptions"></b-form-select>
      </b-form-group>
      <b-form-group id="color" :label="$t('form.color')" label-for="color-input">
        <color-picker class="mr-2" showPalette v-model="newCategory.color" />
      </b-form-group>
    </b-form>

    <div slot="modal-footer">
      <save-button :disabled="newCategory.name && newCategory.name.length < 1" :saving="saving" @click="createCategory()">{{ $t('form.save') }}</save-button>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import ColorPicker from '@/components/shared/ColorPicker'
import SaveButton from '@/components/shared/SaveButton'
export default {
  data: function() {
    return {
      showModal: false,
      saving: false,
      newCategory: {},
    }
  },

  components: {
    ColorPicker,
    SaveButton,
  },

  props: {
    businessUnit: Object,
  },

  watch: {
    showModal(value) {
      if (value) {
        this.newCategory = this.blankCategory()
      }
    },
  },

  computed: {
    ...mapGetters(['gym', 'vatFormOptions']),
  },

  methods: {
    blankCategory() {
      return {
        name: '',
        identifier: '',
        vatRegime: this.businessUnit.vatRegime,
      }
    },

    async createCategory() {
      this.saving = true
      await this.$store.dispatch('createCategory', { data: { ...this.newCategory }, gym: this.gym, businessUnit: this.businessUnit })
      this.$bvToast.toast(`${this.newCategory.name}`, {
        title: this.$i18n.t('forms.category.category_added'),
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
