<template>
  <div class="row">
    <div class="col-12 col-lg-3 pb-3 pb-lg-0">
      <h5 class="text-truncate mb-0" v-if="title != ''">{{ title }}</h5>
      <div class="text-muted py-2" v-if="hasDescriptionSlot">
        <slot name="description"></slot>
      </div>
    </div>
    <div class="col-12 col-lg-9">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  computed: {
    hasDescriptionSlot() {
      return !!this.$slots.description
    },
  },
}
</script>
