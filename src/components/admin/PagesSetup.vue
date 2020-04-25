<template>
  <base-layout>
    <b-row class="py-4">
      <b-col cols="12" lg="3">
        <default-card :title="$t('layout.pages')" :subTitle="pos.name" class="my-3">
          <template slot="actions">
            <b-btn variant="primary" v-b-modal.addPageModal :disabled="!addPageAllowed">
              <font-awesome-icon :icon="['fas', 'plus']" />
              {{ $t('layout.add_page') }}
            </b-btn>
            <b-dropdown class="ml-1" variant="link-secondary" no-caret>
              <template v-slot:button-content>
                <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
              </template>
              <b-dropdown-item v-b-modal.reorderPages>{{ $t('layout.reorder_pages') }}</b-dropdown-item>
            </b-dropdown>
          </template>
          <b-table :fields="fields" :items="orderedPages" class="my-2" v-if="orderedPages.length > 0" :tbody-tr-class="rowClass">
            <template v-slot:cell(icon)="data">
              <font-awesome-icon :icon="['fas', data.item.icon]" v-if="data.item.icon" />
            </template>
            <template v-slot:cell(buttons)="data">{{ data.item.buttons.length }}</template>
            <template v-slot:cell(page)="data">
              <page-dropdown :page="data.item" @delete="pageDeleted(data.item)" @editLayout="editLayout(orderedPages.find(p => p._id === data.item._id))" />
            </template>
          </b-table>
        </default-card>
      </b-col>
      <b-col cols="12" lg="9">
        <page-layout :pageId="editPageId" v-if="editingLayout && editPageId" @done="finishedEditing()" />
      </b-col>
    </b-row>
    <add-page />
    <reorder-pages />
  </base-layout>
</template>
<script>
import { mapGetters } from 'vuex'
import AddPage from '@/components/admin/modals/AddPage'
import BaseLayout from '@/components/shared/BaseLayout'
import DefaultCard from '@/components/shared/DefaultCard'
import PageDropdown from '@/components/admin/_PageDropdown'
import PageLayout from '@/components/admin/PageLayout'
import ReorderPages from '@/components/admin/modals/ReorderPages'
import config from '@/config/config'
export default {
  components: {
    AddPage,
    BaseLayout,
    DefaultCard,
    PageDropdown,
    PageLayout,
    ReorderPages,
  },

  data() {
    return {
      editingLayout: false,
      editPageId: undefined,
    }
  },

  computed: {
    ...mapGetters(['gym', 'pos', 'orderedPages']),

    addPageAllowed() {
      return this.orderedPages.length < config.layout.maxPages
    },

    fields() {
      return [
        { key: 'icon', label: '' },
        { key: 'name', label: this.$i18n.t('datastructure.name') },
        { key: 'buttons', label: this.$i18n.t('layout.buttons') },
        { key: 'page', label: '', tdClass: 'text-right' },
      ]
    },

    tableItems() {
      return this.orderedPages.map(page => {
        return {
          icon: page.icon,
          name: page.name,
          buttons: page.buttons,
          page: page,
        }
      })
    },
  },

  methods: {
    editLayout(page) {
      this.editPageId = page._id
      this.editingLayout = true
    },

    finishedEditing() {
      this.editingLayout = false
      this.editPageId = undefined
    },

    rowClass(page, type) {
      if (!page || type !== 'row') return
      if (this.editingLayout && this.editPageId && this.editPageId === page._id) return 'table-success'
    },

    pageDeleted(page) {
      if (this.editPageId === page._id) {
        this.editPageId = undefined
        this.editingLayout = false
      }
    },
  },
}
</script>
