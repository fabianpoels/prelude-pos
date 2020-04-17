<template>
  <default-card :title="businessUnit.name" :subTitle="businessUnit.identifier" class="my-3">
    <template slot="actions">
      <div class="d-flex">
        <b-btn variant="primary" v-b-modal="`addCategoryModal-${businessUnit._id}`">
          <font-awesome-icon :icon="['fas', 'plus']" />
          {{ $t('datastructure.add_category') }}
        </b-btn>
        <b-dropdown class="ml-1" variant="link-secondary" no-caret>
          <template v-slot:button-content>
            <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
          </template>
          <b-dropdown-item v-b-modal="`editBusinessUnit-${businessUnit._id}`">{{ $t('form.edit') }}</b-dropdown-item>
          <b-dropdown-item v-b-modal="`deleteBusinessUnit-${businessUnit._id}`" v-if="canDeleteBusinessUnit(businessUnit)">{{ $t('form.delete') }}</b-dropdown-item>
          <b-dropdown-item v-b-modal="`deleteBusinessUnit-${businessUnit._id}`" v-else :disabled="!canArchiveBusinessUnit(businessUnit)">{{ $t('form.archive') }}</b-dropdown-item>
        </b-dropdown>
      </div>
    </template>
    <b-table :fields="fields" :items="categories" class="my-2" v-if="categories.length > 0">
      <template v-slot:cell(vatRegime)="data">{{ $helpers.formatVat(data.value) }}</template>
      <template v-slot:cell(category)="data">
        <category-dropdown :category="data.item" />
      </template>
    </b-table>
    <add-category :businessUnit="businessUnit" />
    <edit-business-unit :businessUnit="businessUnit" />
    <delete-business-unit :businessUnit="businessUnit" :archive="!canDeleteBusinessUnit(businessUnit)" />
  </default-card>
</template>
<script>
import { mapGetters } from 'vuex'
import AddCategory from '@/components/admin/modals/AddCategory'
import CategoryDropdown from '@/components/admin/_CategoryDropdown'
import DefaultCard from '@/components/shared/DefaultCard'
import DeleteBusinessUnit from '@/components/admin/modals/DeleteBusinessUnit'
import EditBusinessUnit from '@/components/admin/modals/EditBusinessUnit'
export default {
  components: {
    AddCategory,
    CategoryDropdown,
    DefaultCard,
    DeleteBusinessUnit,
    EditBusinessUnit,
  },

  props: {
    businessUnit: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters(['canArchiveBusinessUnit', 'canDeleteBusinessUnit', 'categoriesForBusinessUnit']),

    categories() {
      return this.categoriesForBusinessUnit(this.businessUnit)
    },

    fields() {
      return [
        { key: 'name', label: this.$i18n.t('datastructure.name') },
        { key: 'identifier', label: this.$i18n.t('datastructure.identifier') },
        { key: 'vatRegime', label: this.$i18n.t('datastructure.vat_regime') },
        { key: 'category', label: '', tdClass: 'text-right' },
      ]
    },
  },
}
</script>
