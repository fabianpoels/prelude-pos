<template>
  <b-modal v-model="showModal" id="reorderPages" :title="$t('layout.reorder_pages')" body-bg-variant="100" no-close-on-backdrop>
    <drag-drop v-model="localPageIds">
      <draggable-page v-for="pageId in localPageIds" :key="pageId" :pageId="pageId" />
    </drag-drop>

    <div slot="modal-footer">
      <save-button :saving="saving" @click="reorderPages()">{{ $t('form.save') }}</save-button>
    </div>
  </b-modal>
</template>

<script>
import DragDrop from 'vuedraggable'
import { mapGetters } from 'vuex'
import DraggablePage from '@/components/admin/modals/_DraggablePage'
import SaveButton from '@/components/shared/SaveButton'
export default {
  data: function() {
    return {
      showModal: false,
      saving: false,
      localPageIds: [],
    }
  },

  components: {
    DragDrop,
    DraggablePage,
    SaveButton,
  },

  watch: {
    showModal(value) {
      if (value) {
        this.localPageIds = [...this.pageIds]
      }
    },
  },

  computed: {
    ...mapGetters(['orderedPages', 'pos']),

    pageIds() {
      return this.orderedPages.map(p => p.id)
    },
  },

  methods: {
    async reorderPages() {
      this.saving = true
      let localPos = { ...this.pos }
      localPos.pages = this.localPageIds
      await this.$store.dispatch('updatePos', localPos)
      this.$bvToast.toast(this.$i18n.t('layout.pages_reordered'), {
        title: this.$i18n.t('layout.pages_reordered'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
      this.saving = false
      this.showModal = false
    },
  },
}
</script>
