import { validateUrl } from './validation.js'
import { fetchRSS } from './api.js'
import { parseRSS } from './rssParser.js'

export const initController = (state) => {
  const form = document.querySelector('#rss-form')
  const input = document.querySelector('#url-input')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const url = input.value.trim()
    state.errors = []

    try {
      await validateUrl(url, state.feeds)

      const xml = await fetchRSS(url)
      const { feed, posts } = parseRSS(xml)

      state.feeds.push({
        id: String(state.feeds.length + 1),
        ...feed,
        link: url,
      })

      state.incomingWeb.unshift(...posts)

      state.state = 'success'
    }
    catch (err) {
      state.errors = err.message.startsWith('errors.')
        ? [err.message]
        : ['errors.network']

      state.state = 'error'
    }
  }

  form.addEventListener('submit', handleSubmit)
}
