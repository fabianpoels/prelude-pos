<template>
  <base-layout>
    <b-row class="justify-content-lg-center py-4">
      <b-col cols="12" lg="8">
        <layout-section :title="$t('gym.localisation')">
          <template slot="description">{{ $t('gym.currency_and_numbers') }}</template>
          <default-card>
            <b-form-row>
              <b-col cols="6">
                <h6 class="mt-3">{{ $t('gym.preview') }}</h6>
                <div>
                  <span>{{ previewCurrencySign }}</span>
                  <br />
                  <span>{{ previewCurrencyText }}</span>
                </div>
              </b-col>
              <b-col cols="6">
                <b-form class="my-3">
                  <b-form-group label-cols-sm="3" :label="`${$t('gym.number_delimiter')}:`" label-align-sm="right" label-for="number-delimter">
                    <b-form-input id="number-delimter" v-model="localSettings.number_delimiter" :disabled="saving" />
                  </b-form-group>
                  <b-form-group label-cols-sm="3" :label="`${$t('gym.number_separator')}:`" label-align-sm="right" label-for="number-separator">
                    <b-form-input id="number-separator" v-model="localSettings.number_separator" :disabled="saving" />
                  </b-form-group>
                  <b-form-group label-cols-sm="3" :label="`${$t('gym.currency')}:`" label-align-sm="right" label-for="currency">
                    <b-form-select v-model="currencySetting" :options="currencyOptions" :disabled="saving" />
                  </b-form-group>
                </b-form>
              </b-col>
              <save-button class="ml-auto" :saving="saving" @click="saveSettings()">{{ $t('form.save') }}</save-button>
            </b-form-row>
          </default-card>
        </layout-section>
        <hr />
        <layout-section :title="$t('gym.vat_options')">
          <default-card>TODO</default-card>
        </layout-section>
        <hr />
        <layout-section :title="$t('settings.tag_reader')">
          <default-card>
            <b-form-row>
              <b-col cols="6">
                <b-form class="my-3">
                  <b-form-group label-cols-sm="3" :label="`${$t('settings.device')}:`" label-align-sm="right" label-for="device">
                    <b-form-select v-model="tagReaderModel" :options="deviceOptions" :disabled="saving" />
                  </b-form-group>
                </b-form>
              </b-col>
              <save-button class="ml-auto" :saving="savingTagReader" @click="saveTagReader()">{{ $t('form.save') }}</save-button>
            </b-form-row>
          </default-card>
        </layout-section>
      </b-col>
    </b-row>
  </base-layout>
</template>
<script>
import { mapGetters } from 'vuex'
import BaseLayout from '@/components/shared/BaseLayout'
import DefaultCard from '@/components/shared/DefaultCard'
import LayoutSection from '@/components/shared/LayoutSection'
import SaveButton from '@/components/shared/SaveButton'
import config from '@/config/config'
export default {
  components: {
    BaseLayout,
    DefaultCard,
    LayoutSection,
    SaveButton,
  },

  data() {
    return {
      localSettings: { ...this.$store.getters.gym.settings },
      localTagReader: this.tagReader && this.tagReader.vendorId && this.tagReader.productId ? { vendorId: this.tagReader.vendorId, productId: this.tagReader.productId } : { vendorId: null, productId: null },
      saving: false,
      savingTagReader: false,
    }
  },

  computed: {
    ...mapGetters(['gym', 'devices', 'tagReader']),

    currencyOptions() {
      return config.currencies.map(currency => {
        return {
          value: currency,
          text: `${currency.text} (${currency.sign})`,
        }
      })
    },

    currencySetting: {
      get() {
        return { sign: this.localSettings.currency_sign, text: this.localSettings.currency_text }
      },
      set(currency) {
        this.localSettings.currency_sign = currency.sign
        this.localSettings.currency_text = currency.text
      },
    },

    deviceOptions() {
      return this.devices.map(d => {
        return {
          value: {
            vendorId: d.vendorId,
            productId: d.productId,
          },
          text: `${d.manufacturer} ${d.product}`,
        }
      })
    },

    previewCurrencySign() {
      return this.$helpers.formatPrice(this.localSettings, 12345.67)
    },

    previewCurrencyText() {
      return this.$helpers.formatPrice(this.localSettings, 12345.67, true)
    },

    tagReaderModel: {
      get() {
        if (this.localTagReader && this.localTagReader.vendorId && this.localTagReader.productId) {
          return { vendorId: this.localTagReader.vendorId, productId: this.localTagReader.productId }
        } else {
          return null
        }
      },
      set({ vendorId, productId }) {
        this.localTagReader.vendorId = vendorId
        this.localTagReader.productId = productId
      },
    },
  },

  mounted() {
    this.localTagReader = this.tagReader && this.tagReader.vendorId && this.tagReader.productId ? { vendorId: this.tagReader.vendorId, productId: this.tagReader.productId } : { vendorId: null, productId: null }
  },

  methods: {
    async saveSettings() {
      this.saving = true
      let localGym = { ...this.gym }
      localGym.settings = this.localSettings
      await this.$store.dispatch('updateGym', localGym)
      this.$bvToast.toast(`${this.gym.name}`, {
        title: this.$i18n.t('forms.gym.gym_saved'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
      this.saving = false
    },

    async saveTagReader() {
      this.savingTagReader = true
      await this.$store.dispatch('saveTagReader', this.localTagReader)
      this.$bvToast.toast(this.$i18n.t('settings.tag_reader_saved'), {
        title: this.$i18n.t('settings.tag_reader_saved'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-top-center',
      })
      this.savingTagReader = false
    },
  },
}
</script>
