<template>
  <b-dropdown variant="link-secondary" no-caret>
    <template v-slot:button-content>
      <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
    </template>
    <b-dropdown-item @click="$emit('editLayout')">{{ $t('layout.layout') }}</b-dropdown-item>
    <b-dropdown-divider></b-dropdown-divider>
    <b-dropdown-item v-b-modal="`editPage-${page._id}`">{{ $t('form.edit') }}</b-dropdown-item>
    <b-dropdown-item v-b-modal="`deletePage-${page._id}`">{{ $t('form.delete') }}</b-dropdown-item>
    <edit-page :page="page" />
    <delete-page :page="page" @delete="$emit('delete')" />
  </b-dropdown>
</template>
<script>
import DeletePage from '@/components/admin/modals/DeletePage'
import EditPage from '@/components/admin/modals/EditPage'
export default {
  components: {
    DeletePage,
    EditPage,
  },

  props: {
    page: {
      type: Object,
      required: true,
    },
  },
}
</script>
