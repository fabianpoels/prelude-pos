<template>
  <b-modal v-model="showModal" id="setupGymModal" :title="$t('setup.setup_gym')" body-bg-variant="100">
    <template v-if="gyms.length > 0">
      <b-form class="my-3">
        <b-form-group id="gym" :label="$t('setup.select_gym')" label-for="gym-name-input">
          <b-form-select v-model="gymId" :disabled="creatingNewGym">
            <option v-for="gym in gyms" :key="gym.id" :value="gym.id">{{ gym.name }}</option>
          </b-form-select>
        </b-form-group>
        <template v-if="creatingNewGym">
          <b-form-group id="gym-name" :label="$t('setup.gym_name')" label-for="gym-name-input">
            <b-form-input id="gym-name-input" v-model="newGym.name" required :label="$t('form.name')" />
          </b-form-group>
          <b-btn variant="outline-secondary" @click="cancelCreateNewGym()">{{ $t('form.cancel') }}</b-btn>
        </template>
        <b-btn v-else variant="outline-secondary" @click="createNewGym()">{{ $t('setup.create_new_gym') }}</b-btn>
      </b-form>
    </template>
    <template v-else>
      <b-form class="my-3">
        <b-form-group id="gym-name" :label="$t('setup.gym_name')" label-for="gym-name-input">
          <b-form-input id="gym-name-input" v-model="newGym.name" required :label="$t('form.name')" />
        </b-form-group>
      </b-form>
    </template>
    <div slot="modal-footer">
      <save-button :disabled="!formComplete" :saving="saving" @click="save()">{{ $t('form.save') }}</save-button>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import SaveButton from './../shared/SaveButton'
export default {
  components: {
    SaveButton,
  },

  data: function() {
    return {
      showModal: false,
      saving: false,
      newGym: {
        name: '',
      },
      gymId: '',
      creatingNewGym: false,
    }
  },

  watch: {
    showModal(value) {
      if (value) {
        this.creatingNewGym = false
        if (this.gym && this.gym.id) this.gymId = this.gym.id
      }
    },
  },

  computed: {
    ...mapGetters(['gym', 'gyms', 'gymById']),

    formComplete() {
      return this.newGym.name.length > 0 || this.gymId.length > 0
    },
  },

  methods: {
    createNewGym() {
      this.creatingNewGym = true
      this.gymId = ''
    },

    cancelCreateNewGym() {
      this.newGym.name = ''
      this.creatingNewGym = false
    },

    async save() {
      this.saving = true
      if (!this.creatingNewGym && this.gymId !== '') {
        let selectedGym = this.gymById(this.gymId)
        this.$store.commit('setGym', selectedGym)
        this.$store.commit('setUsers', selectedGym.users)
        this.$bvToast.toast(this.gymById(this.gymId).name, {
          title: this.$i18n.t('setup.gym_selected'),
          variant: 'success',
          solid: true,
          toaster: 'b-toaster-top-center',
        })
      } else {
        let gym = await this.$store.dispatch('createGym', this.newGym)
        this.$store.commit('setGym', gym)
        this.$bvToast.toast(gym.name, {
          title: this.$i18n.t('setup.gym_created'),
          variant: 'success',
          solid: true,
          toaster: 'b-toaster-top-center',
        })
      }
      this.saving = false
      this.showModal = false
    },
  },
}
</script>
