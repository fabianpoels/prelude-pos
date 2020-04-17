<template>
  <b-modal v-model="showModal" :id="`deleteItem-${item._id}`" :title="`${title} ?`" body-bg-variant="100" no-close-on-backdrop>
    <div>{{ item.name }}</div>

    <div slot="modal-footer">
      <save-button
        :variant="archive ? 'warning' : 'danger'"
        :saving="deleting"
        :savingText="archive ? $t('form.archiving') : $t('form.deleting')"
        @click="remove()"
        >{{ archive ? $t('form.archive') : $t('form.delete') }}</save-button
      >
    </div>
  </b-modal>
</template>

<script>
import SaveButton from '@/components/shared/SaveButton'
export default {
  props: {
    item: Object,
    archive: Boolean,
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

  computed: {
    title() {
      return this.archive ? this.$i18n.t('datastructure.archive_item') : this.$i18n.t('datastructure.delete_item')
    },
  },

  methods: {
    remove() {
      if (this.archive) {
        this.archiveItem()
      } else {
        this.deleteItem()
      }
    },

    async deleteItem() {
      this.deleting = true
      await this.$store.dispatch('deleteItem', this.item)
      this.deleting = false
      this.showModal = false
    },

    async archiveItem() {
      this.deleting = true
      await this.$store.dispatch('archiveItem', this.item)
      this.deleting = false
      this.showModal = false
    },
  },
}
</script>
