<template>
  <b-button :size="size" :variant="variant" :disabled="saving || disabled" @click="$emit('click')">
    <b-spinner small v-if="saving" class="mr-2"></b-spinner>
    <template v-if="saving">{{ savingText }}</template>
    <slot v-else></slot>
  </b-button>
</template>
<script>
export default {
  props: {
    savingText: {
      type: String,
      default: function() {
        return this.$t('form.saving')
      },
    },
    variant: { type: String, default: 'primary' },
    saving: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    size: String,
  },
}
</script>
