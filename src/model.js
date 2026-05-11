import { proxy } from 'valtio/vanilla'

const state = proxy({
  state: 'filling',
  errors: [],
  feeds: [],
  incomingWeb: [],
  uiState: {
    visitedPostIds: new Set(),
    modalPostId: null,
  },
})

export default state
