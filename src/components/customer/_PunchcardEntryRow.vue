<template>
  <b-tr>
    <template v-if="!confirmDelete">
      <b-td>
        <span class="text-muted">{{ number }}</span>
      </b-td>
      <b-td>{{ $helpers.formatDate(gym.settings, luxonDateTime) }}</b-td>
      <b-td>{{ $helpers.formatTime(gym.settings, luxonDateTime) }}</b-td>
      <b-td class="text-muted">
        <template v-if="isAdmin">
          <font-awesome-icon :icon="['fas', 'trash']" class="delete-icon" @click="confirmDelete = true" />
        </template>
      </b-td>
    </template>
    <template v-else>
      <b-td colspan="4" class="centered">
        <b-link @click="deleteEntry()" class="text-danger" :disabled="deleting"><b-spinner small v-if="deleting" class="mr-2"></b-spinner>{{ deleteText }}</b-link>
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
    ...mapGetters(['gym', 'isAdmin']),

    deleteText() {
      return this.deleting ? this.$i18n.t('form.deleting') : this.$i18n.t('form.delete')
    },

    luxonDateTime() {
      return DateTime.fromJSDate(this.entrance)
    },
  },

  data() {
    return {
      confirmDelete: false,
      deleting: false,
    }
  },

  methods: {
    deleteEntry() {
      this.deleting = true
      this.$emit('delete')
    },
  },

  props: {
    entrance: {
      type: Date,
      required: true,
    },
    number: {
      type: Number,
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
