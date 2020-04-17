<template>
  <b-modal
    v-model="showModal"
    id="addBusinessUnitModal"
    :title="$t('datastructure.add_business_unit')"
    body-bg-variant="100"
    no-close-on-backdrop
  >
    <b-form class="my-3">
      <b-form-group id="name" :label="$t('form.name')" label-for="name-input">
        <b-form-input id="name-input" v-model="newBusinessUnit.name" required />
      </b-form-group>
      <b-form-group
        id="identifier"
        :label="$t('datastructure.identifier')"
        label-for="identifier-input"
      >
        <b-form-input id="identifier-input" v-model="newBusinessUnit.identifier" required />
      </b-form-group>
      <b-form-group
        id="vatRegime"
        :label="$t('datastructure.vat_regime')"
        label-for="vatRegime-input"
      >
        <b-form-select v-model="newBusinessUnit.vatRegime" :options="vatFormOptions"></b-form-select>
      </b-form-group>
    </b-form>

    <div slot="modal-footer">
      <save-button
        :disabled="newBusinessUnit.name && newBusinessUnit.name.length < 1"
        :saving="saving"
        @click="createBusinessUnit()"
      >{{ $t('form.save') }}</save-button>
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
      newBusinessUnit: {},
    }
  },

  components: {
    SaveButton,
  },

  watch: {
    showModal(value) {
      if (value) {
        this.newBusinessUnit = this.blankBusinessUnit()
      }
    },
  },

  computed: {
    ...mapGetters(['gym', 'vatFormOptions']),
  },

  methods: {
    blankBusinessUnit() {
      return {
        name: '',
        identifier: '',
        vatRegime: 21,
      }
    },

    async createBusinessUnit() {
      this.saving = true
      await this.$store.dispatch('createBusinessUnit', { data: { ...this.newBusinessUnit }, gym: this.gym })
      this.$bvToast.toast(`${this.newBusinessUnit.name}`, {
        title: this.$i18n.t('forms.business_unit.business_unit_added'),
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
