<template>
  <b-modal v-model="showModal" :id="`editBusinessUnit-${businessUnit._id}`" :title="$t('datastructure.edit_business_unit')" body-bg-variant="100" no-close-on-backdrop>
    <b-form class="my-3">
      <b-form-group id="name" :label="$t('form.name')" label-for="name-input">
        <b-form-input id="name-input" v-model="editBusinessUnit.name" required />
      </b-form-group>
      <b-form-group id="identifier" :label="$t('datastructure.identifier')" label-for="identifier-input">
        <b-form-input id="identifier-input" v-model="editBusinessUnit.identifier" required />
      </b-form-group>
      <b-form-group id="vatRegime" :label="$t('datastructure.vat_regime')" label-for="vatRegime-input">
        <b-form-select v-model="editBusinessUnit.vatRegime" :options="vatFormOptions"></b-form-select>
      </b-form-group>
    </b-form>

    <div slot="modal-footer">
      <save-button :disabled="editBusinessUnit.name && editBusinessUnit.name.length < 1" @click="updateBusinessUnit()">{{ $t('form.save') }}</save-button>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import SaveButton from '@/components/shared/SaveButton'
export default {
  props: {
    businessUnit: {
      type: Object,
      required: true,
    },
  },

  data: function() {
    return {
      showModal: false,
      saving: false,
      editBusinessUnit: {},
    }
  },

  components: {
    SaveButton,
  },

  watch: {
    showModal(value) {
      if (value) {
        this.editBusinessUnit = { ...this.businessUnit }
      }
    },
  },

  computed: {
    ...mapGetters(['vatFormOptions']),
  },

  methods: {
    async updateBusinessUnit() {
      this.saving = true
      await this.$store.dispatch('updateBusinessUnit', this.editBusinessUnit)
      this.$bvToast.toast(`${this.editBusinessUnit.name}`, {
        title: this.$i18n.t('forms.business_unit.business_unit_saved'),
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
