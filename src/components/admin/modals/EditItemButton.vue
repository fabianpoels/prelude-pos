<template>
  <b-modal v-model="showModal" :id="`editItemButton-${page._id}-${x}-${y}`" :title="$t('layout.edit_button')" body-bg-variant="100" no-close-on-backdrop>
    <b-form class="my-3">
      <b-form-group id="item" :label="$t('datastructure.item')" label-for="item-input">
        <el-select id="item-input" v-model="editButton.item" :placeholder="$t('datastructure.item')" class="w-100" filterable>
          <el-option-group v-for="category in categories" :key="category._id" :label="category.name">
            <el-option v-for="item in itemsForCategory(category)" :key="item._id" :label="item.name" :value="item._id">
              <span>{{ item.name }}</span>
            </el-option>
          </el-option-group>
        </el-select>
      </b-form-group>
      <b-form-group id="color" :label="$t('form.color')" label-for="color-input">
        <color-picker class="mr-2" showPalette v-model="editButton.color" />
      </b-form-group>
    </b-form>

    <div slot="modal-footer">
      <template v-if="!confirmDelete">
        <b-btn variant="danger" @click="confirmDelete = true" class="mr-2">{{ $t('form.delete') }}</b-btn>
        <save-button :disabled="!editButton.item || (editButton.item && editButton.item.length < 1)" :saving="saving" @click="updatePage()">{{ $t('form.save') }}</save-button>
      </template>
      <template v-else>
        <span class="mr-2">{{ $t('form.are_you_sure') }}?</span>
        <save-button variant="danger" :saving="deleting" :saveText="$t('form.deleting')" @click="deleteButton()">{{ $t('form.delete') }}</save-button>
        <b-btn variant="outline-secondary" @click="confirmDelete = false" :disabled="deleting" class="ml-2">{{ $t('form.cancel') }}</b-btn>
      </template>
    </div>
  </b-modal>
</template>
<script>
import { mapGetters } from 'vuex'
import ColorPicker from '@/components/shared/ColorPicker'
import SaveButton from '@/components/shared/SaveButton'
export default {
  props: {
    page: {
      type: Object,
      required: true,
    },
    button: {
      type: Object,
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
    ColorPicker,
    SaveButton,
  },

  data() {
    return {
      editButton: { ...this.button },
      showModal: false,
      saving: false,
      deleting: false,
      confirmDelete: false,
    }
  },

  watch: {
    'editButton.item'(id) {
      let category = this.categoryById(this.itemById(id).category)
      this.editButton.color = category.color
    },
  },

  computed: {
    ...mapGetters(['categories', 'itemsForCategory', 'itemById', 'categoryById']),
  },

  methods: {
    async deleteButton() {
      this.deleting = true
      await this.$store.dispatch('removeButtonFromPage', { page: this.page, button: this.button })
      this.deleting = false
      this.confirmDelete = false
      this.showModal = false
    },

    updatePage() {
      this.saving = true
      let page = { ...this.page }
      let buttons = [...page.buttons]
      buttons.splice(
        buttons.findIndex(b => b.key === `${this.x}:${this.y}`),
        1,
        this.editButton
      )
      page.buttons = buttons
      this.$store.dispatch('updatePage', page)
      this.saving = false
      this.showModal = false
    },
  },
}
</script>
