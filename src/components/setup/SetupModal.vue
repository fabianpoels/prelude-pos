<template>
  <b-modal v-model="showModal" id="SetupModal" title="Setup" body-bg-variant="100">
    <b-tabs justified>
      <b-tab title="Pos">
        <b-form class="my-3">
          <b-form-group id="pos-uuid" label="UUID" label-for="pos-uuid-input">
            <b-form-input id="pos-uuid-input" :value="pos._id" required disabled />
          </b-form-group>
          <b-form-group id="pos-name" label="Name" label-for="pos-name-input">
            <b-form-input id="pos-name-input" v-model="pos.name" required placeholder="Pos name" />
          </b-form-group>
        </b-form>
      </b-tab>

      <b-tab title="Gym">
        <b-form v-if="gyms.length > 0" class="my-3">
          <b-form-select v-model="pos.gym">
            <option v-for="gym in gyms" :key="gym._id.toString()" :value="gym._id">{{ gym.name }}</option>
          </b-form-select>
        </b-form>
        <b-form v-else class="my-3">
          <b-form-group id="gym-name" label="Name" label-for="gym-name-input">
            <b-form-input id="gym-name-input" v-model="newGym.name" required placeholder="Gym name" />
          </b-form-group>
        </b-form>
      </b-tab>
    </b-tabs>
    <div slot="modal-footer">
      <save-button :disabled="!formComplete" :saving="saving" @click="setup()">{{ $t('form.save') }}</save-button>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import SaveButton from './../shared/SaveButton'
export default {
  name: 'setup-modal',

  components: {
    SaveButton,
  },

  props: {
    uuid: String,
  },

  created() {
    this.$store.dispatch('loadAllGyms').catch(error => {
      console.log(error)
      this.$bvToast.toast(error.message, {
        title: 'Error loading gyms',
        variant: 'warning',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
    })
  },

  data: function() {
    return {
      showModal: false,
      saving: false,
      pos: {
        name: '',
        _id: this.uuid,
        gym: null,
      },
      newGym: {
        name: '',
      },
    }
  },

  watch: {
    uuid(value) {
      this.pos._id = value
    },
  },

  computed: {
    ...mapGetters(['gyms', 'gymById']),

    formComplete() {
      if (this.gyms.length > 0) {
        return this.pos.name !== '' && this.pos.gym !== null
      } else {
        return this.pos.name !== '' && this.newGym.name !== ''
      }
    },
  },

  methods: {
    setup() {
      this.saving = true
      if (this.gyms.length > 0) {
        this.$store
          .dispatch('createPos', this.pos)
          .then(newPos => {
            this.$store.commit('setGym', this.gymById(newPos.gym))
            this.$store.commit('setPos', newPos)
            this.saving = false
            this.$bvToast.toast('POS created', {
              title: 'Setup complete',
              variant: 'success',
              solid: true,
              toaster: 'b-toaster-top-center',
            })
            this.showModal = false
            this.$store.commit('showSetupButton', false)
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        this.$store
          .dispatch('createGym', this.newGym)
          .then(newGym => {
            this.pos.gym = newGym._id
            this.$store
              .dispatch('createPos', this.pos)
              .then(newPos => {
                this.$store.commit('setGym', newGym)
                this.$store.commit('setPos', newPos)
                this.$store
                  .dispatch('addPosToGym', { pos: newPos, gym: newGym })
                  .then(() => {
                    this.$bvToast.toast('POS and gym created', {
                      title: 'Setup complete',
                      variant: 'success',
                      solid: true,
                      toaster: 'b-toaster-top-center',
                    })
                    this.saving = false
                    this.showModal = false
                    this.$store.commit('showSetupButton', false)
                  })
                  .catch(error => {
                    console.log(error)
                  })
              })
              .catch(error => {
                console.log(error)
              })
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
  },
}
</script>

<style scoped></style>
