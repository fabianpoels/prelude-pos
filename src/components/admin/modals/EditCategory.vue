<template>
  <b-modal v-model="showModal" :id="`editCategory-${category.id}`" :title="$t('datastructure.edit_category')" body-bg-variant="100" no-close-on-backdrop>
    <b-form class="my-3">
      <b-form-group id="name" :label="$t('form.name')" label-for="name-input">
        <b-form-input id="name-input" v-model="editCategory.name" required />
      </b-form-group>
      <b-form-group id="identifier" :label="$t('datastructure.identifier')" label-for="identifier-input">
        <b-form-input id="identifier-input" v-model="editCategory.identifier" required />
      </b-form-group>
      <b-form-group id="vatRegime" :label="$t('datastructure.vat_regime')" label-for="vatRegime-input">
        <b-form-select v-model="editCategory.vatRegime" :options="vatFormOptions"></b-form-select>
      </b-form-group>
      <b-form-group id="color" :label="$t('form.color')" label-for="color-input">
        <color-picker class="mr-2" showPalette v-model="editCategory.color" />
      </b-form-group>
    </b-form>

    <div slot="modal-footer">
      <save-button :disabled="editCategory.name && editCategory.name.length < 1" @click="updateCategory()">{{ $t('form.save') }}</save-button>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import ColorPicker from '@/components/shared/ColorPicker'
import SaveButton from '@/components/shared/SaveButton'
export default {
  props: {
    category: {
      type: Object,
      required: true,
    },
  },

  data: function() {
    return {
      showModal: false,
      saving: false,
      editCategory: {},
    }
  },

  components: {
    ColorPicker,
    SaveButton,
  },

  watch: {
    showModal(value) {
      if (value) {
        this.editCategory = { ...this.category }
      }
    },
  },

  computed: {
    ...mapGetters(['vatFormOptions']),
  },

  methods: {
    async updateCategory() {
      this.saving = true
      await this.$store.dispatch('updateCategory', this.editCategory)
      this.$bvToast.toast(`${this.editCategory.name}`, {
        title: this.$i18n.t('forms.category.category_saved'),
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
