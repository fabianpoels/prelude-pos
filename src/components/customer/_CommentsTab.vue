<template>
  <b-tab :title="$t('customer.comments')" class="pt-4">
    <b-form class="my-3" inline>
      <b-form-textarea v-model="newComment" rows="3" />
      <save-button :disabled="newComment === ''" :saving="saving" @click="addComment()" class="ml-2" :savingText="$t('customer.add_comment')">{{ $t('customer.add_comment') }}</save-button>
    </b-form>
    <b-table-simple>
      <b-thead>
        <b-th>{{ $t('customer.comment') }}</b-th>
        <b-th>{{ $t('entrytoken.date') }}</b-th>
        <b-th>{{ $t('setup.user') }}</b-th>
      </b-thead>
      <b-tbody>
        <comment-row v-for="comment in comments" :key="comment._id.toString()" :comment="comment" />
      </b-tbody>
    </b-table-simple>
  </b-tab>
</template>
<script>
import { DateTime } from 'luxon'
import { mapGetters } from 'vuex'
import CommentRow from '@/components/customer/_CommentRow'
import SaveButton from '@/components/shared/SaveButton'
export default {
  components: {
    CommentRow,
    SaveButton,
  },

  computed: {
    ...mapGetters(['currentUser', 'gym']),

    comments() {
      return [...this.customer.comments].reverse()
    },
  },

  data() {
    return {
      saving: false,
      newComment: '',
    }
  },

  methods: {
    async addComment() {
      this.saving = true
      await this.$store.dispatch('addCommentToCustomer', {
        customer: this.customer,
        comment: this.newComment,
        user: this.currentUser,
        datetime: DateTime.local().toJSDate(),
      })
      this.$bvToast.toast(`${this.customer.firstname} ${this.customer.lastname}`, {
        title: this.$i18n.t('customer.comment_added'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
      this.newComment = ''
      this.saving = false
    },
  },

  props: {
    customer: {
      type: Object,
      required: true,
    },
  },
}
</script>
