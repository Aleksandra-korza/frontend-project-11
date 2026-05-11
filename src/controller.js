import state from './model.js'
import yup from './validation.js'
import { parsIncomingWeb } from './rssParser.js'

const chekLink = (linkRSS) => {
  state.errors = []
  yup.string().required().url()
    .notOneOf(state.feeds.map(feed => feed.link))
    .validate(linkRSS)
    .then(() => {
      state.state = 'success'
      parsIncomingWeb(linkRSS)
    })
    .catch((err) => {
      state.errors = [err.message]
      state.state = 'error'
    })
}

export { chekLink }
