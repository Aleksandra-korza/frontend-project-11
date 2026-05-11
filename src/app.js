import './style.css'
import 'bootstrap'
import { subscribe } from 'valtio/vanilla'

import state from './model.js'
import initI18n from './i18n.js'
import { initView } from './view.js'
import { initController } from './controller.js'
import { updateFeeds } from './updater.js'

const app = async () => {
  const i18next = await initI18n()

  const view = initView(state, i18next)

  subscribe(state, view.renderForm)
  subscribe(state, view.renderContent)
  subscribe(state.uiState, view.renderModal)

  initController(state)
  updateFeeds(state)
}

app()
