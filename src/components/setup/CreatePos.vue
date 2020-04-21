<template>
  <b-modal v-model="showModal" id="createPos" title="Setup" body-bg-variant="100">
    <b-form class="my-3">
      <b-form-group id="pos-uuid" label="UUID" label-for="pos-uuid-input">
        <b-form-input id="pos-uuid-input" :value="pos._id" required disabled />
      </b-form-group>
      <b-form-group id="pos-name" label="Name" label-for="pos-name-input">
        <b-form-input id="pos-name-input" v-model="pos.name" required placeholder="Pos name" />
      </b-form-group>
    </b-form>
    <div slot="modal-footer">
      <save-button :disabled="!formComplete" :saving="saving" @click="createPos()">{{ $t('form.save') }}</save-button>
    </div>
  </b-modal>
</template>

<script>
import SaveButton from '@/components/shared/SaveButton'
export default {
  name: 'setup-modal',

  components: {
    SaveButton,
  },

  props: {
    uuid: {
      type: String,
      required: true,
    },
    gym: {
      type: Object,
      required: true,
    },
  },

  data: function() {
    return {
      showModal: false,
      saving: false,
      pos: {
        name: '',
        _id: this.uuid,
        gym: this.gym._id,
      },
    }
  },

  computed: {
    formComplete() {
      return this.pos.name !== '' && this.newGym.name !== ''
    },
  },

  methods: {
    async createPos() {
      this.saving = true
      await this.$store.dispatch('createPos', this.pos)
      this.$bvToast.toast(this.pos.name, {
        title: this.$i18n.t('setup.created'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
    },
  },
}
</script>

<style scoped></style>
