<template>
  <base-layout>
    <b-row class="justify-content-lg-center py-4">
      <b-col cols="12" lg="8">
        <business-unit v-for="businessUnit in businessUnits" :key="businessUnit.id" :businessUnit="businessUnit" />
      </b-col>
      <b-col cols="12" lg="8" class="mt-3">
        <div class="d-flex justify-content-end">
          <b-btn variant="outline-primary" v-b-modal.addBusinessUnitModal>
            <font-awesome-icon :icon="['fas', 'plus']" />
            {{ $t('datastructure.add_business_unit') }}
          </b-btn>
        </div>
      </b-col>
    </b-row>
    <add-business-unit />
  </base-layout>
</template>
<script>
import { mapGetters } from 'vuex'
import BaseLayout from '@/components/shared/BaseLayout'
import BusinessUnit from '@/components/admin/BusinessUnit'
import AddBusinessUnit from '@/components/admin/modals/AddBusinessUnit'
export default {
  components: {
    AddBusinessUnit,
    BaseLayout,
    BusinessUnit,
  },

  computed: {
    ...mapGetters(['businessUnits', 'gym']),
  },
}
</script>
