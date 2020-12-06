<template>
  <b-modal v-model="showModal" id="createPos" :title="$t('setup.create_pos')" body-bg-variant="100">
    <b-form class="my-3">
      <!-- <b-form-group id="pos-uuid" label="UUID" label-for="pos-uuid-input">
        <b-form-input id="pos-uuid-input" :value="pos.id" required disabled />
      </b-form-group> -->
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
import { mapGetters } from 'vuex'
import SaveButton from '@/components/shared/SaveButton'
export default {
  components: {
    SaveButton,
  },

  computed: {
    ...mapGetters(['gym',]),

    formComplete() {
      return this.pos.name !== '' && this.pos.gym !== ''
    },
  },

  data: function() {
    return {
      showModal: false,
      saving: false,
      pos: {
        name: '',
        gym: '',
      },
    }
  },

  methods: {
    async createPos() {
      this.saving = true
      let savedPos = await this.$store.dispatch('createPos', this.pos)
      this.$store.dispatch('savePosUuid', savedPos.id)
      this.$bvToast.toast(this.pos.name, {
        title: this.$i18n.t('setup.created'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
      this.saving = false
      this.showModal = false
    },
  },

  watch: {
    showModal(show) {
      if (show) {
        if (this.gym.id) this.pos.gym = this.gym.id
      }
    },
  },
}
</script>
