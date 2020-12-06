<template>
  <b-modal v-model="showModal" :id="`deleteBusinessUnit-${businessUnit.id}`" :title="`${title} ?`" body-bg-variant="100" no-close-on-backdrop>
    <div>{{ businessUnit.name }}</div>

    <div slot="modal-footer">
      <save-button :variant="archive ? 'warning' : 'danger'" :saving="deleting" :savingText="archive ? $t('form.archiving') : $t('form.deleting')" @click="remove()">
        {{ archive ? $t('form.archive') : $t('form.delete') }}
      </save-button>
    </div>
  </b-modal>
</template>

<script>
import SaveButton from '@/components/shared/SaveButton'
export default {
  props: {
    businessUnit: Object,
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
      return this.archive ? this.$i18n.t('datastructure.archive_business_unit') : this.$i18n.t('datastructure.delete_business_unit')
    },
  },

  methods: {
    remove() {
      if (this.archive) {
        this.archiveBusinessUnit()
      } else {
        this.deleteBusinessUnit()
      }
    },

    async deleteBusinessUnit() {
      this.deleting = true
      await this.$store.dispatch('deleteBusinessUnit', this.businessUnit)
      this.deleting = false
      this.showModal = false
    },

    async archiveBusinessUnit() {
      this.deleting = true
      await this.$store.dispatch('archiveBusinessUnit', this.businessUnit)
      this.deleting = false
      this.showModal = false
    },
  },
}
</script>
