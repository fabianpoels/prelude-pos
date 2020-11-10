<template>
  <b-card class="mb-2">
    {{ token }}
  </b-card>
</template>
<script>
export default {
  props: {
    token: {
      type: Object,
      required: true,
    },
  },
}
</script>
