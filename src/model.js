import { proxy } from 'valtio/vanilla'

const state = proxy({
  linkRSS: 'samLink',
  state: 'processing',
  button: 'aktive',
  errors: [],
  feeds: [],
  incomingWeb: [],
  uiState: {
    visitedPostIds: new Set(),
    modalPostId: null,
  },
})

export default state
