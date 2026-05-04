import './style.css'
import { proxy, subscribe } from 'valtio/vanilla'
import * as yup from 'yup'
import i18next from 'i18next'
import 'bootstrap'

const form = document.querySelector('#rss-form')
const input = document.querySelector('#url-input')
const feedback = document.querySelector('.feedback')
const postsList = document.querySelector('.posts-list')
const feedsList = document.querySelector('.feeds-list')

const state = proxy({
  linkRSS: 'samLink',
  state: 'processing',   // success, error
  button: 'aktive',      // 'noAktive'
  errors: [],
  feeds: [],
  incomingWeb: [],
  uiState: {
    visitedPostIds: new Set(),
    modalPostId: null,
  },
})

const texts = {
  lng: 'ru',
  resources: {
    ru: {
      translation: {
        success: 'RSS успешно загружен',
        errors: {
          required: 'Не должно быть пустым',
          invalidUrl: 'Ссылка должна быть валидным URL',
          duplicate: 'RSS уже существует',
          noRss: 'Ресурс не содержит валидный RSS',
          network: 'Ошибка сети',
        },
      },
    },
  },
}

yup.setLocale({
  mixed: {
    required: 'errors.required',
    notOneOf: 'errors.duplicate',
  },
  string: {
    url: 'errors.invalidUrl',
  },
})

await i18next.init(texts)

const render = () => {
  input.classList.remove('error', 'success')
  feedback.classList.remove('error', 'success')
  feedback.textContent = ''

  if (state.state === 'error') {
    input.classList.add('error')
    feedback.classList.add('error')
    feedback.textContent = state.errors.map(error => i18next.t(error)).join('. ')
    input.focus()
  } else if (state.state === 'success') {
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
      } else {
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

// Подписки
subscribe(state, render)
subscribe(state, render2)
subscribe(state.uiState, renderModal)

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
      };

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

form.addEventListener('submit', (e) => {
  e.preventDefault()
  chekLink(input.value.trim())
})

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

updateFeeds()
