<template>
  <div>
    <b-dropdown variant="link-secondary" no-caret>
      <template v-slot:button-content>
        <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
      </template>
      <b-dropdown-item v-b-modal="`editCategory-${category._id}`">{{ $t('form.edit')}}</b-dropdown-item>
      <b-dropdown-item
        v-if="canDeleteCategory(category)"
        v-b-modal="`deleteCategory-${category._id}`"
      >{{ $t('form.delete')}}</b-dropdown-item>
      <b-dropdown-item
        v-else
        :disabled="!canArchiveCategory(category)"
        v-b-modal="`deleteCategory-${category._id}`"
      >{{ $t('form.archive')}}</b-dropdown-item>
    </b-dropdown>
    <edit-category :category="category" />
    <delete-category :category="category" :archive="!canDeleteCategory(category)" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import DeleteCategory from '@/components/admin/modals/DeleteCategory'
import EditCategory from '@/components/admin/modals/EditCategory'
export default {
  props: {
    category: {
      type: Object,
      required: true,
    },
  },

  components: {
    DeleteCategory,
    EditCategory,
  },

  data() {
    return {
      deleting: false,
    }
  },

  computed: {
    ...mapGetters(['canArchiveCategory', 'canDeleteCategory']),
  },
}
</script>