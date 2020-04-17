<template>
  <div class="bg-white shadow-sm rounded p-3" :class="{ 'h-100' : fullHeight }">
    <div class="row align-items-center justify-content-between" v-if="hasTitle">
      <div class="col-12 col-md-auto py-1">
        <div v-if="title != ''" class="h3 mb-1">{{ title }}</div>
        <div v-if="subTitle != ''" class="text-muted">{{ subTitle }}</div>
      </div>
      <div class="col-12 col-md-auto py-1"></div>
    </div>
    <slot></slot>
    <div class="border-top pt-3 mt-3" v-if="hasActionsSlot">
      <slot name="actions"></slot>
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
    subTitle: {
      type: String,
      default: '',
    },
    tooltip: String,
    fullHeight: Boolean,
  },

  computed: {
    hasTitle() {
      return this.title || this.subTitle
    },

    hasActionsSlot() {
      return !!this.$slots.actions
    },
  },

  data: function() {
    return {}
  },
}
</script>
