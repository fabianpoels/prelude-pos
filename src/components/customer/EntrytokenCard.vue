<template>
  <b-overlay :show="confirmDelete" rounded="sm">
    <b-card class="mb-2" :border-variant="valid ? 'success' : ''">
      <div class="d-flex flex-column">
        <div class="d-flex flex-row justify-content-between align-items-center">
          <div class="h5 token-title"><slot name="title"></slot></div>
          <div>
            <slot name="title-actions"></slot>
            <b-dropdown variant="link-secondary" no-caret v-if="isAdmin">
              <template v-slot:button-content>
                <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
              </template>
              <b-dropdown-item @click="confirmDelete = true">{{ $t('form.delete') }}</b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div>
      <slot></slot>
    </b-card>
    <template v-slot:overlay>
      <save-button size="sm" variant="danger" :saving="deleting" :savingText="$t('form.deleting')" @click="deleteEntrytoken()">{{ $t('form.delete') }}</save-button>
      <b-btn class="ml-2" size="sm" variant="secondary" @click="confirmDelete = false" :disabled="deleting">{{ $t('form.cancel') }}</b-btn>
    </template>
  </b-overlay>
</template>
<script>
import { mapGetters } from 'vuex'
import SaveButton from '@/components/shared/SaveButton'
export default {
  components: {
    SaveButton,
  },

  computed: {
    ...mapGetters(['isAdmin']),
  },

  data() {
    return {
      confirmDelete: false,
      deleting: false,
    }
  },

  methods: {
    deleteEntrytoken() {
      this.deleting = true
      this.$store.dispatch('deleteEntryTokenItemFromCustomer', { customer: this.customer, token: this.token })
      this.deleting = false
    },
  },

  props: {
    customer: {
      type: Object,
      required: true,
    },
    token: {
      type: Object,
      required: true,
    },
    valid: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
