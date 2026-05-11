import state from './model.js'

const updateFeeds = async () => {
  const promises = state.feeds.map(async (feed) => {
    try {
      const url = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(feed.link)}&v=${Date.now()}`
      const response = await fetch(url)
      const data = await response.json()
      const xml = new DOMParser().parseFromString(data.contents, 'text/xml')
      const items = Array.from(xml.querySelectorAll('item'))

      const fetchedPosts = items.map(item => ({
        title: item.querySelector('title')?.textContent ?? '',
        post: item.querySelector('link')?.textContent ?? '',
        description: item.querySelector('description')?.textContent ?? '',
        feedId: feed.id,
      }))

      const newPosts = fetchedPosts.filter(fp => !state.incomingWeb.some(ep => ep.post === fp.post))

      if (newPosts.length > 0) {
        state.incomingWeb.unshift(...newPosts.map(p => ({ ...p, id: Math.random().toString(36).substring(2) })))
      }
    }
    catch (e) {
      console.error('Ошибка при обновлении фида:', e)
    }
  })

  await Promise.all(promises)
  setTimeout(updateFeeds, 5000)
}

export { updateFeeds }