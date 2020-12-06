<template>
  <b-tr>
    <b-td>{{ comment.comment }}</b-td>
    <b-td>
      <div>{{ date }}</div>
      <div>{{ time }}</div>
    </b-td>
    <b-td>{{ userById(comment.user.toString()).displayname }}</b-td>
  </b-tr>
</template>
<script>
import { DateTime } from 'luxon'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['gym', 'userById']),

    date() {
      return this.$helpers.formatDate(this.gym.settings, DateTime.fromJSDate(this.comment.datetime))
    },

    time() {
      return this.$helpers.formatTime(this.gym.settings, DateTime.fromJSDate(this.comment.datetime))
    },
  },

  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
}
</script>
