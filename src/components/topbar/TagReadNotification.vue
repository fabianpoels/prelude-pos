<template>
  <div>
    <template v-if="tags.length > 0">
      <b-button variant="warning" v-if="tag.customer && tag.customer !== null" @click="viewCustomer">
        <font-awesome-icon :icon="['fas', 'user']" size="2x" />
      </b-button>
      <b-button variant="warning" v-else v-b-modal.tag-assign-modal>
        <font-awesome-icon :icon="['fas', 'tag']" size="2x" />
      </b-button>
      <tag-assign-modal :tag="tag" />
      <view-customer :customer="tagCustomer" v-if="tagCustomer" modalIdSuffix="topbar" />
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TagAssignModal from '@/components/tag/TagAssignModal'
import ViewCustomer from '@/components/customer/ViewCustomer'
export default {
  components: {
    TagAssignModal,
    ViewCustomer,
  },

  computed: {
    ...mapGetters(['tags', 'customerById']),

    tag() {
      return this.tags[0]
    },
  },

  data() {
    return {
      tagCustomer: null,
    }
  },

  watch: {
    tag(tag) {
      if (tag.customer) {
        this.tagCustomer = { ...this.customerById(this.tag.customer) }
      }
    },
  },

  methods: {
    viewCustomer() {
      if (this.tagCustomer) {
        this.$bvModal.show(`viewCustomer-${this.tagCustomer._id}-topbar`)
      }
    },
  },
}
</script>
