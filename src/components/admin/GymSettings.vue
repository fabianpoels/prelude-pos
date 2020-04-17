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
      saving: false,
    }
  },

  computed: {
    ...mapGetters(['gym']),

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

    previewCurrencySign() {
      return this.$helpers.formatPrice(this.localSettings, 12345.67)
    },

    previewCurrencyText() {
      return this.$helpers.formatPrice(this.localSettings, 12345.67, true)
    },
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
  },
}
</script>
