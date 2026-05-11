import state from './model.js'
import i18next from './i18n.js'

const form = document.querySelector('#rss-form')
const input = document.querySelector('#url-input')
const feedback = document.querySelector('.feedback')
const postsList = document.querySelector('.posts-list')
const feedsList = document.querySelector('.feeds-list')

const render = () => {
  input.classList.remove('error', 'success')
  feedback.classList.remove('error', 'success')
  feedback.textContent = ''

  if (state.state === 'error') {
    input.classList.add('error')
    feedback.classList.add('error')
    feedback.textContent = state.errors.map(error => i18next.t(error)).join('. ')
    input.focus()
  }
  if (state.state === 'success') {
    feedback.classList.add('success')
    feedback.textContent = i18next.t('success')
    input.value = ''
    input.focus()
  }
}

const render2 = () => {
  postsList.innerHTML = ''
  state.incomingWeb.forEach((item) => {
    const postItem = document.createElement('li')
    postItem.classList.add('post-item', 'd-flex', 'justify-content-between', 'align-items-start', 'mb-2')
    const el = document.createElement('a')
    el.href = item.post
    el.textContent = item.title
    el.target = '_blank'
    el.rel = 'noopener noreferrer'

    const isVisited = state.uiState.visitedPostIds.has(item.id)
    if (isVisited) {
      el.classList.add('fw-normal', 'link-secondary', 'post-link')
    }
    else {
      el.classList.add('fw-bold', 'post-link')
    }
    const button = document.createElement('button')
    button.textContent = 'Просмотр'
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
    button.setAttribute('data-id', item.id)
    button.setAttribute('data-bs-toggle', 'modal')
    button.setAttribute('data-bs-target', '#modal')

    button.addEventListener('click', () => {
      state.uiState.modalPostId = item.id
      state.uiState.visitedPostIds.add(item.id)
    })

    postItem.appendChild(el)
    postItem.appendChild(button)
    postsList.appendChild(postItem)
  })

  feedsList.innerHTML = ''
  state.feeds.forEach((item) => {
    const feedItem = document.createElement('li')
    feedItem.classList.add('feed-item', 'mb-3')
    feedItem.innerHTML = `<h3>${item.title}</h3><p>${item.description}</p>`
    feedsList.appendChild(feedItem)
  })
}

const renderModal = () => {
  const { modalPostId } = state.uiState
  if (!modalPostId) return

  const post = state.incomingWeb.find(p => p.id === modalPostId)
  if (!post) return

  document.querySelector('.modal-title').textContent = post.title
  document.querySelector('.modal-body').textContent = post.description
  document.querySelector('.full-article').href = post.post
}

export {
  form,
  input,
  render,
  render2,
  renderModal,
}