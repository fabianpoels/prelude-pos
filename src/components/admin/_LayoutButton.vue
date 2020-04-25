<template>
  <div class="buttonCell">
    <b-btn v-if="button" variant="secondary" class="button" v-b-modal="`editItemButton-${page._id}-${x}-${y}`" :style="{ backgroundColor: button.color, borderColor: button.color }">
      {{ itemById(button.item).name }}
    </b-btn>
    <b-btn variant="outline-secondary" class="button" v-else v-b-modal="`addItemButton-${page._id}-${x}-${y}`">
      <font-awesome-icon :icon="['fas', 'plus']" size="2x" class="iconAdd" />
    </b-btn>
    <edit-item-button v-if="button" :x="x" :y="y" :page="page" :button="button" />
    <add-item-button v-else :x="x" :y="y" :page="page" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AddItemButton from '@/components/admin/modals/AddItemButton'
import EditItemButton from '@/components/admin/modals/EditItemButton'
export default {
  props: {
    pageId: {
      type: String,
      required: true,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },

  components: {
    AddItemButton,
    EditItemButton,
  },

  data() {
    return {
      editing: false,
    }
  },

  computed: {
    ...mapGetters(['itemById', 'pageById']),

    button() {
      return this.page.buttons.find(b => b.key === `${this.x}:${this.y}`)
    },

    page() {
      return this.pageById(this.pageId)
    },
  },

  methods: {
    editButton() {
      this.editing = true
    },
  },
}
</script>
<style scoped>
.buttonCell,
.button {
  width: 100%;
  height: 100%;
  min-width: 80px;
  max-width: 300px;
  min-height: 80px;
  max-height: 300px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.button > .iconAdd {
  display: none;
}

.button:hover > .iconAdd {
  display: inline-block;
}
</style>
