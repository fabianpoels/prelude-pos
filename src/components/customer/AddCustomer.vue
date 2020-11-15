<template>
  <b-modal v-model="showModal" size="lg" :id="`addCustomerModal-${modalSuffix}`" :title="$t('customer.add_customer')" body-bg-variant="100" no-close-on-backdrop @hidden="$emit('hidden')">
    <b-form class="my-3">
      <b-form-row>
        <b-col>
          <b-form-group id="firstname" :label="$t('user.firstname')" label-for="firstname-input">
            <template slot="label">
              <font-awesome-icon :icon="['fas', 'user']" />
              {{ $t('user.firstname') }}
            </template>
            <b-form-input id="firstname-input" v-model="newCustomer.firstname" required :disabled="saving" />
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group id="lastname" :label="$t('user.lastname')" label-for="lastname-input">
            <b-form-input id="lastname-input" v-model="newCustomer.lastname" required :disabled="saving" />
          </b-form-group>
        </b-col>
      </b-form-row>
      <b-form-row>
        <b-col cols="7">
          <b-form-group id="email" :label="$t('customer.email')" label-for="email-input">
            <template slot="label">
              <font-awesome-icon :icon="['fas', 'envelope']" />
              {{ $t('customer.email') }}
            </template>
            <b-form-input id="email-input" v-model="newCustomer.email" required :disabled="saving" />
          </b-form-group>
        </b-col>
        <b-col cols="5">
          <b-form-group id="phone" :label="$t('customer.phone')" label-for="phone-input">
            <template slot="label">
              <font-awesome-icon :icon="['fas', 'phone']" />
              {{ $t('customer.phone') }}
            </template>
            <b-form-input id="phone-input" v-model="newCustomer.phone" required :disabled="saving" />
          </b-form-group>
        </b-col>
      </b-form-row>
      <!-- <b-form-row>
        <b-col cols="2">
          <b-form-group id="phone" :label="$t('customer.phone')" label-for="phone-input">
            <template slot="label">
              <font-awesome-icon :icon="['fas', 'phone']" />
              {{ $t('customer.phone') }}
            </template>
            <b-form-input id="phone-input" v-model="newCustomer.phone" required :disabled="saving" />
          </b-form-group>
        </b-col>
      </b-form-row> -->

      <b-form-row class="mt-4">
        <b-col cols="12">
          <b-form-group id="address" :label="$t('customer.address')" label-for="address-input">
            <template slot="label">
              <font-awesome-icon :icon="['fas', 'map-marked-alt']" />
              {{ $t('customer.address') }}
            </template>
            <b-form-input id="address-input" v-model="newCustomer.address.street" required :disabled="saving" />
          </b-form-group>
        </b-col>
      </b-form-row>
      <b-form-row>
        <b-col cols="5">
          <b-form-group id="town" :label="$t('customer.town')" label-for="town-input">
            <template slot="label">
              <font-awesome-icon :icon="['fas', 'city']" />
              {{ $t('customer.town') }}
            </template>
            <b-form-input id="town-input" v-model="newCustomer.address.town" required :disabled="saving" />
          </b-form-group>
        </b-col>
        <b-col cols="2">
          <b-form-group id="zipCode" :label="$t('customer.zipCode')" label-for="zipCode-input">
            <b-form-input id="zipCode-input" v-model="newCustomer.address.zipCode" required :disabled="saving" />
          </b-form-group>
        </b-col>
        <b-col cols="5">
          <b-form-group id="country" :label="$t('customer.country')" label-for="country-input">
            <template slot="label">
              <font-awesome-icon :icon="['fas', 'globe-americas']" />
              {{ $t('customer.country') }}
            </template>
            <el-select id="country-input" v-model="newCustomer.address.country" :placeholder="$t('customer.country')" class="w-100" filterable>
              <el-option v-for="(country, index) in countries" :key="index" :label="country" :value="country">
                {{ country }}
              </el-option>
            </el-select>
          </b-form-group>
        </b-col>
      </b-form-row>
    </b-form>

    <div slot="modal-footer">
      <save-button :disabled="!validInput" :saving="saving" @click="createCustomer()">{{ $t('form.save') }}</save-button>
    </div>
  </b-modal>
</template>
<script>
import countries from '@/config/countries'
import config from '@/config/config'
import { mapGetters } from 'vuex'
import SaveButton from '@/components/shared/SaveButton'
export default {
  components: {
    SaveButton,
  },

  computed: {
    ...mapGetters(['gym', 'gyms']),

    validInput() {
      return true
    },

    countries() {
      return countries
    },
  },

  data: function() {
    return {
      showModal: false,
      saving: false,
      newCustomer: this.blankCustomer(),
    }
  },

  methods: {
    blankCustomer() {
      if (this.customerData && this.customerData !== null) {
        return { ...this.customerData }
      }
      return {
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        address: {
          street: '',
          zipCode: '',
          town: '',
          country: config.defaultCountry,
        },
      }
    },

    async createCustomer() {
      this.saving = true
      await this.$store.dispatch('createCustomer', { ...this.newCustomer })
      this.$bvToast.toast(`${this.newCustomer.firstname} ${this.newCustomer.lastname}`, {
        title: this.$i18n.t('customer.customer_added'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
      this.saving = false
      this.showModal = false
    },
  },

  props: {
    customerData: Object,
    modalSuffix: String,
  },

  watch: {
    showModal(value) {
      if (value) {
        this.newCustomer = this.blankCustomer()
      }
    },
  },
}
</script>
