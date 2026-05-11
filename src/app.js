import { subscribe } from 'valtio/vanilla'
import state from './model.js'
import { form, input } from './view.js'
import { render, render2, renderModal } from './view.js'
import './i18n.js'
import './validation.js'
import { chekLink } from './controller.js'
import { updateFeeds } from './updater.js'

subscribe(state, render)
subscribe(state, render2)
subscribe(state.uiState, renderModal)

form.addEventListener('submit', (e) => {
  e.preventDefault()
  chekLink(input.value.trim())
})

updateFeeds()
