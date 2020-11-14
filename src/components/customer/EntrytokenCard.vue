<template>
  <b-overlay :show="confirmDelete" rounded="sm">
    <b-card class="mb-2" :border-variant="active ? 'success' : ''" :bg-variant="valid ? '' : 'secondary'" :text-variant="valid ? '' : 'white'">
      <template v-slot:header>
        <div class="d-flex flex-column">
          <div class="d-flex flex-row justify-content-between align-items-center">
            <div class="h5 token-title" @click="expanded = !expanded"><font-awesome-icon :icon="['fas', collapseIcon]" class="mr-2" /><slot name="title"></slot></div>
            <div>
              <slot name="title-actions">
                <save-button variant="success" size="sm" v-if="valid" :disabled="active" :saving="registering" :savingText="$t('entrytoken.entry')" @click="registerEntry()">{{ $t('entrytoken.entry') }}</save-button>
              </slot>
              <b-dropdown variant="link-secondary" no-caret v-if="isAdmin" :disabled="registering">
                <template v-slot:button-content>
                  <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
                </template>
                <b-dropdown-item @click="confirmDelete = true">{{ $t('form.delete') }}</b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
        </div>
      </template>
      <slot name="no-collapse"></slot>
      <b-collapse v-model="expanded" :accordion="`entry-token-accordion-${this.customer._id}`">
        <slot></slot>
      </b-collapse>
    </b-card>
    <template v-slot:overlay>
      <save-button size="sm" variant="danger" :saving="deleting" :savingText="$t('form.deleting')" @click="deleteEntrytoken()">{{ $t('form.delete') }}</save-button>
      <b-btn class="ml-2" size="sm" variant="secondary" @click="confirmDelete = false" :disabled="deleting">{{ $t('form.cancel') }}</b-btn>
    </template>
  </b-overlay>
</template>
<script>
import { mapGetters } from 'vuex'
import { DateTime } from 'luxon'
import SaveButton from '@/components/shared/SaveButton'
export default {
  components: {
    SaveButton,
  },

  computed: {
    ...mapGetters(['isAdmin']),

    active() {
      return this.token.entrances.some(e => DateTime.fromJSDate(e).hasSame(DateTime.local(), 'day'))
    },

    collapseIcon() {
      return this.expanded ? 'chevron-up' : 'chevron-down'
    },
  },

  data() {
    return {
      confirmDelete: false,
      deleting: false,
      expanded: false,
      registering: false,
    }
  },

  methods: {
    deleteEntrytoken() {
      this.deleting = true
      this.$store.dispatch('deleteEntryTokenItemFromCustomer', { customer: this.customer, token: this.token })
      this.deleting = false
    },

    async registerEntry() {
      this.registering = true
      await this.$store.dispatch('registerEntry', { customer: this.customer, token: this.token, date: DateTime.local().toJSDate() })
      let item = this.token.item
      let price = this.token.price
      let text = `${item.name}${price.name !== null && price.name !== '' ? `: ${price.name}` : ''} - ${this.customer.firstname} ${this.customer.lastname}`
      this.$bvToast.toast(text, {
        title: this.$i18n.t('entrytoken.entry_registered'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
      this.registering = false
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
<style scoped>
.token-title {
  cursor: pointer !important;
}
</style>
