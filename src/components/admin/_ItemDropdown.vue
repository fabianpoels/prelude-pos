<template>
  <div>
    <b-dropdown variant="link-secondary" no-caret>
      <template v-slot:button-content>
        <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
      </template>
      <b-dropdown-item v-b-modal="`editItem-${item.id}`">{{ $t('form.edit') }}</b-dropdown-item>
      <b-dropdown-item v-b-modal="`editItemPrices-${item.id}`">{{ $t('datastructure.edit_prices') }}</b-dropdown-item>
      <b-dropdown-item v-if="canDeleteItem(item)" v-b-modal="`deleteItem-${item.id}`">{{ $t('form.delete') }}</b-dropdown-item>
      <b-dropdown-item v-else :disabled="!canArchiveItem(item)" v-b-modal="`deleteItem-${item.id}`">{{ $t('form.archive') }}</b-dropdown-item>
    </b-dropdown>
    <edit-item :item="item" />
    <edit-item-prices :item="item" :category="category" />
    <delete-item :item="item" :archive="!canDeleteItem(item)" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import DeleteItem from '@/components/admin/modals/DeleteItem'
import EditItem from '@/components/admin/modals/EditItem'
import EditItemPrices from '@/components/admin/modals/EditItemPrices'
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  components: {
    DeleteItem,
    EditItem,
    EditItemPrices,
  },

  data() {
    return {
      deleting: false,
    }
  },

  computed: {
    ...mapGetters(['canArchiveItem', 'canDeleteItem', 'categoryById']),

    category() {
      return this.categoryById(this.item.category.toString())
    },
  },
}
</script>
