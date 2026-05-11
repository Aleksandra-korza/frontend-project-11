import state from './model.js'

const parsIncomingWeb = (linkRSS) => {
  const proxyUrl = 'https://allorigins.hexlet.app/get?disableCache=true&url='
  fetch(`${proxyUrl}${encodeURIComponent(linkRSS)}`)
    .then((response) => {
      if (response.ok) return response.json()
      throw new Error('Network response was not ok.')
    })
    .then((data) => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(data.contents, 'text/xml')
      if (doc.querySelector('parsererror')) {
        throw new Error('errors.noRss')
      }
      const titleFeed = doc.querySelector('channel > title')?.textContent ?? ''
      const descriptionFeed = doc.querySelector('channel > description')?.textContent ?? ''
      state.feeds.push({
        id: String(state.feeds.length + 1),
        title: titleFeed,
        description: descriptionFeed,
        link: linkRSS,
      })
      const items = doc.querySelectorAll('item')
      const posts = Array.from(items).map(item => ({
        id: Math.random().toString(36).substring(2),
        title: item.querySelector('title')?.textContent ?? '',
        description: item.querySelector('description')?.textContent ?? '',
        post: item.querySelector('link')?.textContent ?? '',
      }))

      state.incomingWeb.unshift(...posts)
    })
    .catch((error) => {
      state.errors = error.message.startsWith('errors.')
        ? [error.message]
        : ['errors.network']

      state.state = 'error'
    })
}

export { parsIncomingWeb }