<template>
  <div class="buttonCell">
    <b-btn v-if="button" variant="secondary" class="button" :class="{ layoutButton: customButton }" v-b-modal="`editItemButton-${page.id}-${x}-${y}`" :style="buttonStyle">
      {{ itemById(button.item.toString()).name }}
    </b-btn>
    <b-btn variant="outline-secondary" class="button" v-else v-b-modal="`addItemButton-${page.id}-${x}-${y}`">
      <font-awesome-icon :icon="['fas', 'plus']" size="2x" class="iconAdd" />
    </b-btn>
    <edit-item-button v-if="button" :x="x" :y="y" :page="page" :button="button" />
    <add-item-button v-else :x="x" :y="y" :page="page" />
  </div>
</template>
<script>
import chroma from 'chroma-js'
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

    customButton() {
      return this.button.color && this.button.color !== ''
    },

    buttonStyle() {
      if (this.customButton) {
        let chromaColor = chroma(this.button.color)
        return {
          '--color': this.button.color,
          '--color-hover': chromaColor.darken(0.5),
          '--text-color': chromaColor.luminance() > 0.5 ? '#000' : '#fff',
        }
      } else {
        return {}
      }
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

.layoutButton {
  background-color: var(--color);
  border-color: var(--color);
  color: var(--text-color);
}

.layoutButton:hover {
  background-color: var(--color-hover);
  border-color: var(--color-hover);
}
</style>
