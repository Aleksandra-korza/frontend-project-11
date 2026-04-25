import './style.css';
import { proxy } from 'valtio/vanilla';
import { subscribe } from 'valtio/vanilla';
import * as yup from 'yup';
import i18next from 'i18next';


const form = document.querySelector('#rss-form');
const input = document.querySelector('#url-input');
const button = document.querySelector('.rss-button');
const feedback = document.querySelector('.feedback');

const state = proxy({
    linkRSS: 'samLink',
    state: 'processing',   // success, error
    button: 'aktive',      // 'noAktive'
    errors: [],
    feedback: '',
    url: "",
    feeds: [],
    incomingWeb: []
  });

const texts = {
        lng: 'ru',
        resources: {
          ru: {
            translation: {
              success: 'RSS успешно загружен', //state.text.resources.ru.translation.success
              errors: {
                required: 'Не должно быть пустым',
                invalidUrl: 'Ссылка должна быть валидным URL',
                duplicate: 'RSS уже существует',
              },
            },
          },
        },
      };

      yup.setLocale({
        mixed: {
          required: 'errors.required',
          notOneOf: 'errors.duplicate',
        },
        string: {
          url: 'errors.invalidUrl',
        },
      })

await i18next.init(texts);


const render = () => {
    input.classList.remove('error', 'success');
    feedback.classList.remove('error', 'success');
    feedback.textContent = '';

    if (state.state === 'error') {
        input.classList.add('error');
        feedback.classList.add('error');
        feedback.textContent = state.errors.map((error) => i18next.t(error)).join('. ');
        input.focus();
        return;

      } else {
        input.classList.remove('error');
        feedback.classList.remove('error');
      }
    
    if (state.state === 'success') {
        feedback.classList.add('success');
        state.button = 'aktive';
        feedback.textContent = i18next.t('success');
        input.value = '';
        input.focus(); 
    } 
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const linkRSS = input.value.trim();
    chekLink(linkRSS);
  })

  const chekLink = (linkRSS) => {
    state.errors = [];
    yup
        .string() //→ тип
        .required() //→ не пусто
        .url() //→ валидный URL
        .notOneOf(state.feeds.map((feed) => feed.link)) //→ не дубликат
        .validate(linkRSS) //→ запускает проверку
        .then(() => {
            state.state = 'success';
            input.value = '';
            input.focus();
            render();

            parsIncomingWeb(linkRSS);
        }) //→ успех
        .catch((err) => {
            state.errors.push(err.message);
            state.state = 'error';
            state.button = 'noAktive';
            input.classList.add('error');
            render();
        return;
        }) //→ ошибка

    }

    subscribe(state, render);

const parsIncomingWeb = (linkRSS) => {

  const proxyUrl = 'https://allorigins.hexlet.app/get?url=';
    
  fetch(`${proxyUrl}${encodeURIComponent(linkRSS)}`)
  .then(response => {
    if (response.ok) return response.json()
    throw new Error('Network response was not ok.')
  })
  .then(data => {
    const parser = new DOMParser();
    const document = parser.parseFromString(data.contents, "text/xml");
    const parserError = document.querySelector('parsererror');

    // ФИД (один раз)
    const titleFeed = document.querySelector('channel > title')?.textContent ?? '';
    const descriptionFeed = document.querySelector('channel > description')?.textContent ?? '';
    const link = document.querySelector('channel > link')?.textContent ?? '';
    

    if (parserError) {
        throw new Error('Ошибка парсинга RSS');
      }


    state.feeds.push({
        id: String(state.feeds.length + 1),
        title: titleFeed,
        description: descriptionFeed,
        link: link,
    });


      const items = document.querySelectorAll('item');

      items.forEach((item, index) => {
        const title = item.querySelector('title')?.textContent ?? '';
        const description = item.querySelector('description')?.textContent ?? '';
        const post = item.querySelector('link')?.textContent ?? '';

        state.incomingWeb.push({id: String(state.incomingWeb.length + 1), description: description, title: title, post: post})

      });

    render2();

    })
    .catch((error) => {
      state.errors = [error.message];
      state.state = 'error';
    });
    
}

const postsList = document.querySelector('.posts-list');

  const render2 = () => {

    postsList.innerHTML = '';

    state.incomingWeb.forEach((item) => {
      // контейнер поста
      const postItem = document.createElement('div');
      postItem.classList.add('post-item');

      const el = document.createElement('a');
      el.classList.add("post-link");
      el.href = item.post;
      el.textContent = item.title;

      // кнопка
    const button = document.createElement('button');
    button.classList.add('post-button');
    button.type = 'button';
    button.textContent = 'Просмотр';

    // собираем
    postItem.appendChild(el);
    postItem.appendChild(button);
    postsList.appendChild(postItem);
  });

  const feedsList = document.querySelector('.feeds-list');
  feedsList.innerHTML = '';

  state.feeds.forEach((item) => {
    // контейнер поста
    const feedItem = document.createElement('div');
    feedItem.classList.add('feeds-list');
    feedItem.classList.add('feed-item');

    const el = document.createElement('h3');
      el.classList.add("feed-title");
      el.textContent = item.title;
    const el2 = document.createElement('p');
    el2.classList.add("feed-description");
    el2.textContent = item.description;

    feedItem.appendChild(el);
    feedItem.appendChild(el2);
    feedsList.appendChild(feedItem);

  })

};
