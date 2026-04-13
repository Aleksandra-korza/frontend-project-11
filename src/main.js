import './style.css';
import { proxy } from 'valtio/vanilla';
import { subscribe } from 'valtio/vanilla';
import * as yup from 'yup';


const form = document.querySelector('#rss-form');
const input = document.querySelector('#url-input');
const button = document.querySelector('.rss-button');
const feedback = document.querySelector('.feedback');

const state = proxy({
    feeds: [],
    linkRSS: 'samLink',
    state: 'processing',  // success, error
    button: 'aktive',     // 'noAktive'
    errors: [],
    feedback: ''
});

const render = () => {
    input.classList.remove('error', 'success');
    feedback.classList.remove('error', 'success');
    feedback.textContent = '';

    if (state.state === 'error') {
        input.classList.add('error');
        feedback.classList.add('error');
        feedback.textContent = state.errors.join('. ');
        input.focus();
        return;

      } else {
        input.classList.remove('error');
        feedback.classList.remove('error');
      }
    
    if (state.state === 'success') {
        feedback.classList.add('success');
        state.button = 'aktive';
        feedback.textContent = 'RSS успешно загружен';
        input.value = '';
        input.focus();
        
    }
    
    }

if (!form) {
    console.error('Форма не найдена');
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
        .required('Не должно быть пустым') //→ не пусто
        .url('Ссылка должна быть валидным URL') //→ валидный URL
        .notOneOf(state.feeds, 'Такой URL уже есть') //→ не дубликат
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

//render();

