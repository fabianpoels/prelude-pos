<template>
  <b-overlay :show="confirmDelete" rounded="sm">
    <b-overlay :show="saving" rounded="sm" spinner-small class="mt-2">
      <b-input-group class="mb-2">
        <b-form-input type="text" v-model="localPrice.name" :disabled="!editing" :readonly="!editing" />
        <b-form-input v-if="editing" type="number" v-model="localPrice.salesPrice" :disabled="!editing" :readonly="!editing" />
        <b-form-input v-else type="text" :value="$helpers.formatPrice(gym.settings, localPrice.salesPrice)" :disabled="!editing" :readonly="!editing" />
        <b-form-select v-model="localPrice.vatRegime" :options="vatFormOptions" :disabled="!editing"></b-form-select>
        <template v-if="editing">
          <b-input-group-append>
            <b-btn variant="primary" @click="save()" class="price-button">
              <font-awesome-icon :icon="['fas', 'save']" />
            </b-btn>
          </b-input-group-append>
          <b-input-group-append>
            <b-btn variant="secondary" @click="cancelEdit()" class="price-button">
              <font-awesome-icon :icon="['fas', 'times']" />
            </b-btn>
          </b-input-group-append>
        </template>
        <template v-else>
          <b-input-group-append>
            <b-btn variant="primary" @click="editing = true" class="price-button">
              <font-awesome-icon :icon="['fas', 'edit']" />
            </b-btn>
          </b-input-group-append>
          <b-input-group-append>
            <b-btn variant="danger" @click="confirmDelete = true" class="price-button" :disabled="priceHasButton(price)">
              <font-awesome-icon :icon="['fas', 'trash']" />
            </b-btn>
          </b-input-group-append>
        </template>
      </b-input-group>
    </b-overlay>
    <template v-slot:overlay>
      <save-button size="sm" variant="danger" :saving="deleting" :saveText="$t('form.deleting')" @click="deletePrice()">{{ $t('form.delete') }}</save-button>
      <b-btn size="sm" variant="secondary" @click="confirmDelete = false" :disabled="deleting">{{ $t('form.cancel') }}</b-btn>
    </template>
  </b-overlay>
</template>
<script>
import { mapGetters } from 'vuex'
import SaveButton from '@/components/shared/SaveButton'
export default {
  props: {
    price: {
      type: Object,
      required: true,
    },
  },

  components: {
    SaveButton,
  },

  data() {
    return {
      localPrice: { ...this.price },
      editing: false,
      confirmDelete: false,
      deleting: false,
      saving: false,
    }
  },

  computed: {
    ...mapGetters(['gym', 'vatFormOptions', 'priceHasButton']),
  },

  methods: {
    async save() {
      this.saving = true
      await this.$store.dispatch('updatePrice', this.localPrice)
      this.saving = false
      this.editing = false
      this.localPrice = { ...this.price }
    },

    cancelEdit() {
      this.editing = false
      this.localPrice = { ...this.price }
    },

    async deletePrice() {
      this.deleting = true
      await this.$store.dispatch('deletePrice', { ...this.price })
    },
  },
}
</script>
<style scoped>
.price-button {
  width: 40px;
}
</style>
