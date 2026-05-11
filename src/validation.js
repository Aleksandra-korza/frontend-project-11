import * as yup from 'yup'

yup.setLocale({
  mixed: {
    required: 'errors.required',
    notOneOf: 'errors.duplicate',
  },
  string: {
    url: 'errors.invalidUrl',
  },
})

export const validateUrl = (url, feeds) => {
  const links = feeds.map(feed => feed.link)

  return yup
    .string()
    .required()
    .url()
    .notOneOf(links)
    .validate(url)
}
