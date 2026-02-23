import { createI18n } from 'vue-i18n'
import cs from './cs'
import en from './en'

const savedLocale = localStorage.getItem('locale') ?? 'cs'

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'cs',
  messages: { cs, en },
})

export function setLocale(locale: 'cs' | 'en') {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
}
