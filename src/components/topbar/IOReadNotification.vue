<template>
  <div>
    <template v-if="idCard && idCard !== null">
      <b-button variant="warning" v-if="idCardCustomer && idCardCustomer !== null" @click="viewIdCardCustomer()">
        <font-awesome-icon :icon="['fas', 'id-card']" size="2x" />
      </b-button>
      <b-button variant="warning" v-else v-b-modal.addCustomerModal-topbar>
        <font-awesome-icon :icon="['fas', 'id-card']" size="2x" />
      </b-button>
      <add-customer :customerData="customerData" modalSuffix="topbar" @hidden="removeScannedIdCard()" />
      <view-customer :customer="idCardCustomer" v-if="idCardCustomer" modalIdSuffix="topbar-idcard" @hidden="removeScannedIdCard()" />
    </template>
    <template v-if="tags.length > 0">
      <b-button variant="warning" v-if="tag.customer && tag.customer !== null" @click="viewTagCustomer()">
        <font-awesome-icon :icon="['fas', 'user']" size="2x" />
      </b-button>
      <b-button variant="warning" v-else v-b-modal.tag-assign-modal>
        <font-awesome-icon :icon="['fas', 'tag']" size="2x" />
      </b-button>
      <tag-assign-modal :tag="tag" @hidden="removeScannedTag()" />
      <view-customer :customer="tagCustomer" v-if="tagCustomer" modalIdSuffix="topbar-nfctag" @hidden="removeScannedTag()" />
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AddCustomer from '@/components/customer/AddCustomer'
import TagAssignModal from '@/components/tag/TagAssignModal'
import ViewCustomer from '@/components/customer/ViewCustomer'
export default {
  components: {
    AddCustomer,
    TagAssignModal,
    ViewCustomer,
  },

  computed: {
    ...mapGetters(['tags', 'customerById', 'idCard', 'customerByNationalNumber']),

    customerData() {
      let id = this.idCard
      return {
        firstname: id.firstnames,
        lastname: id.surname,
        nationalNumber: id.nationalNumber,
        address: {
          street: id.addressAndStreetNumber,
          zipCode: id.addressZipcode,
          town: id.addressMunicipality,
          country: 'Belgium',
        },
      }
    },

    idCardCustomer() {
      if (this.idCard && this.idCard.nationalNumber) {
        return this.customerByNationalNumber(this.idCard.nationalNumber)
      }
      return null
    },

    tag() {
      return this.tags[0]
    },

    tagCustomer() {
      if (this.tag && this.tag.customer) {
        return this.customerById(this.tag.customer)
      }
      return null
    },
  },

  methods: {
    removeScannedIdCard() {
      this.$store.commit('removeIdCard')
    },

    removeScannedTag() {
      this.$store.commit('deleteTag', this.tag)
    },

    viewIdCardCustomer() {
      this.$bvModal.show(`viewCustomer-${this.idCardCustomer._id}-topbar-idcard`)
    },

    viewTagCustomer() {
      this.$bvModal.show(`viewCustomer-${this.tagCustomer._id}-topbar-nfctag`)
    },
  },
}
</script>
