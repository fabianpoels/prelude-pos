<template>
  <b-tr>
    <template v-if="!confirmDelete">
      <b-td>{{ tag.tagId.toUpperCase() }}</b-td>
      <b-td>{{ dateAssigned }}</b-td>
      <b-td>{{ lastScanned }}</b-td>
      <b-td class="text-muted">
        <font-awesome-icon :icon="['fas', 'trash']" class="delete-icon" @click="confirmDelete = true" />
      </b-td>
    </template>
    <template v-else>
      <b-td colspan="4" class="centered">
        <b-link @click="deleteTag()" class="text-danger" :disabled="deleting"><b-spinner small v-if="deleting" class="mr-2"></b-spinner>{{ deleteText }}</b-link>
        <b-link @click="confirmDelete = false" class="ml-2 text-secondary" :disabled="deleting">{{ $t('form.cancel') }}</b-link>
      </b-td>
    </template>
  </b-tr>
</template>
<script>
import { DateTime } from 'luxon'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['gym']),

    dateAssigned() {
      return this.$helpers.formatDateTime(this.gym.settings, DateTime.fromJSDate(this.tag.dateAssigned))
    },

    deleteText() {
      return this.deleting ? this.$i18n.t('form.deleting') : this.$i18n.t('form.delete')
    },

    lastScanned() {
      return this.$helpers.formatDateTime(this.gym.settings, DateTime.fromJSDate(this.tag.lastScanned))
    },
  },

  data() {
    return {
      confirmDelete: false,
      deleting: false,
    }
  },

  methods: {
    deleteTag() {
      this.deleting = true
      this.$emit('delete')
    },
  },

  props: {
    tag: {
      type: Object,
      required: true,
    },
  },
}
</script>
<style scoped>
.delete-icon {
  cursor: pointer;
}

.centered {
  text-align: center;
}

.disabled {
  pointer-events: none;
}
</style>
