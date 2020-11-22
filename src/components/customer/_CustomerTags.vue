<template>
  <b-table-simple>
    <b-thead>
      <b-th>{{ $t('tag.uid').toUpperCase() }}</b-th>
      <b-th>{{ $t('tag.date_assigned') }}</b-th>
      <b-th>{{ $t('tag.last_scanned') }}</b-th>
      <b-th></b-th>
    </b-thead>
    <b-tbody>
      <tag-row v-for="tag in tags" :tag="tag" :key="tag.tagId" @delete="unassignTag(tag)" />
    </b-tbody>
  </b-table-simple>
</template>
<script>
import TagRow from '@/components/customer/_TagRow'
export default {
  components: {
    TagRow,
  },

  data() {
    return {
      deleting: false,
    }
  },

  methods: {
    async unassignTag(tag) {
      this.deleting = true
      await this.$store.dispatch('unassignTag', tag)
      this.$emit('reload')
      this.deleting = false
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
