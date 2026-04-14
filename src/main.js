import './style.css';
import { proxy } from 'valtio/vanilla';
import { subscribe } from 'valtio/vanilla';
import * as yup from 'yup';
import i18next from 'i18next'


const form = document.querySelector('#rss-form');
const input = document.querySelector('#url-input');
const button = document.querySelector('.rss-button');
const feedback = document.querySelector('.feedback');

const state = proxy({
    feeds: [],
    linkRSS: 'samLink',
    state: 'processing',   // success, error
    button: 'aktive',      // 'noAktive'
    errors: [],
    feedback: ''
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
        .notOneOf(state.feeds) //→ не дубликат
        .validate(linkRSS) //→ запускает проверку
        .then(() => {
            state.state = 'success';
            input.value = '';
            input.focus();
            state.feeds.push(linkRSS);
            render();
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

