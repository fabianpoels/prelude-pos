<template>
  <b-modal v-model="showModal" :id="`deleteCategory-${category._id}`" :title="`${title} ?`" body-bg-variant="100" no-close-on-backdrop>
    <div>{{ category.name }}</div>

    <div slot="modal-footer">
      <save-button :variant="archive ? 'warning' : 'danger'" :saving="deleting" :savingText="archive ? $t('form.archiving') : $t('form.deleting')" @click="remove()">{{ archive ? $t('form.archive') : $t('form.delete') }}</save-button>
    </div>
  </b-modal>
</template>

<script>
import SaveButton from '@/components/shared/SaveButton'
export default {
  props: {
    category: Object,
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
      return this.archive ? this.$i18n.t('datastructure.archive_category') : this.$i18n.t('datastructure.delete_category')
    },
  },

  methods: {
    remove() {
      if (this.archive) {
        this.archiveCategory()
      } else {
        this.deleteCategory()
      }
    },

    async deleteCategory() {
      this.deleting = true
      await this.$store.dispatch('deleteCategory', this.category)
      this.deleting = false
      this.showModal = false
    },

    async archiveCategory() {
      this.deleting = true
      await this.$store.dispatch('archiveCategory', this.category)
      this.deleting = false
      this.showModal = false
    },
  },
}
</script>
