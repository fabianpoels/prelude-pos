<template>
  <b-table :fields="fields" :items="tableTags" />
</template>
<script>
import { DateTime } from 'luxon'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['gym']),

    fields() {
      return [
        { key: 'uid', label: this.$i18n.t('tag.uid').toUpperCase() },
        { key: 'updatedAt', label: this.$i18n.t('tag.date_assigned') },
        { key: 'lastScanned', label: this.$i18n.t('tag.last_scanned') },
      ]
    },

    tableTags() {
      return this.tags.map(t => {
        return {
          uid: t.tagId.toUpperCase(),
          updatedAt: this.$helpers.formatDateTime(this.gym.settings, DateTime.fromJSDate(t.dateAssigned)),
          lastScanned: this.$helpers.formatDateTime(this.gym.settings, DateTime.fromJSDate(t.lastScanned)),
        }
      })
    },
  },

  props: {
    tags: {
      type: Array,
      required: true,
    },
    customer: {
      type: Object,
      required: true,
    },
  },
}
</script>
