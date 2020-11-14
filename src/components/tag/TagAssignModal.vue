<template>
  <b-modal v-model="showModal" id="tag-assign-modal" :title="$t('tag.assign_tag')" @hidden="$emit('hidden')">
    <b-form-group id="tagUid" :label="$t('tag.uid')">
      <b-form-input id="tagUid-input" v-model="localTag.tagId" readonly />
    </b-form-group>
    <b-form-group id="customer" :label="$t('customer.customer')" label-for="customer-input">
      <el-select id="customer-input" v-model="localTag.customer" :placeholder="$t('customer.customer')" class="w-100" filterable>
        <el-option v-for="customer in customers" :key="customer._id" :label="`${customer.firstname} ${customer.lastname}`" :value="customer._id">
          {{ customer.firstname }} {{ customer.lastname }} ({{ customer.address.town }})
        </el-option>
      </el-select>
    </b-form-group>
    <div slot="modal-footer">
      <save-button :saving="saving" @click="saveAssign()">{{ $t('form.save') }}</save-button>
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

  props: {
    tag: Object,
  },

  data() {
    return {
      localTag: { ...this.tag, customer: null },
      saving: false,
      showModal: false,
    }
  },

  watch: {
    showModal() {
      this.localTag = { ...this.tag, customer: null }
    },
  },

  computed: {
    ...mapGetters(['customers']),
  },

  methods: {
    async saveAssign() {
      this.saving = true
      await this.$store.dispatch('assignTag', this.localTag)
      this.$bvToast.toast(this.$i18n.t('tag.tag_assigned'), {
        title: this.$i18n.t('tag.tag_assigned'),
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
