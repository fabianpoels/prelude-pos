<template>
  <b-modal v-model="showModal" :id="`deletePage-${page._id}`" :title="`${$t('layout.delete_page')} ?`" body-bg-variant="100" no-close-on-backdrop>
    <div>
      <font-awesome-icon :icon="['fas', page.icon]" />
      {{ page.name }}
    </div>

    <div slot="modal-footer">
      <save-button variant="danger" :saving="deleting" :savingText="$t('form.deleting')" @click="deletePage()">{{ $t('form.delete') }}</save-button>
    </div>
  </b-modal>
</template>

<script>
import SaveButton from '@/components/shared/SaveButton'
export default {
  props: {
    page: {
      type: Object,
      required: true,
    },
  },

  data: function() {
    return {
      showModal: false,
      deleting: false,
    }
  },

  components: {
    SaveButton,
  },

  methods: {
    async deletePage() {
      this.deleting = true
      this.$emit('delete')
      await this.$store.dispatch('deletePage', this.page)
      this.deleting = false
      this.showModal = false
    },
  },
}
</script>
