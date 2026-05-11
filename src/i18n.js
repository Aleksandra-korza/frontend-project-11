import i18next from 'i18next'

const texts = {
  lng: 'ru',
  resources: {
    ru: {
      translation: {
        success: 'RSS успешно загружен',
        errors: {
          required: 'Не должно быть пустым',
          invalidUrl: 'Ссылка должна быть валидным URL',
          duplicate: 'RSS уже существует',
          noRss: 'Ресурс не содержит валидный RSS',
          network: 'Ошибка сети',
        },
      },
    },
  },
}

await i18next.init(texts)

export default i18next
