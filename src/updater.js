import { fetchRSS } from './api.js'
import { parseRSS } from './rssParser.js'

export const updateFeeds = async (state) => {
  const promises = state.feeds.map(async (feed) => {
    try {
      const xml = await fetchRSS(`${feed.link}&v=${Date.now()}`)
      const { posts } = parseRSS(xml)

      const postsWithFeedId = posts.map(post => ({
        ...post,
        feedId: feed.id,
      }))

      const newPosts = postsWithFeedId.filter(
        post => !state.incomingWeb.some(existingPost => existingPost.post === post.post),
      )

      state.incomingWeb.unshift(...newPosts)
    }
    catch (e) {
      console.error('Ошибка при обновлении фида:', e)
    }
  })

  await Promise.all(promises)

  setTimeout(() => updateFeeds(state), 5000)
}
