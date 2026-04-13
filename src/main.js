import './style.css';

const form = document.querySelector('#rss-form');
const input = document.querySelector('#url-input');
const button = document.querySelector('.rss-button');
const feedback = document.querySelector('.feedback');

const state = {
    feeds: [],
    linkRSS: 'samLink',
    state: 'processing',  // success, error
    button: 'aktive',     // 'noAktive'
    errors: [],
    feedback: ''
}

const feedsCopy = (linkRSS) => {
    const arrFeeds = state.feeds;
    return arrFeeds.filter((feed) => feed === linkRSS.value.trim());
}


const render = () => {
    input.classList.remove('error', 'success');
    feedback.classList.remove('error', 'success');
    feedback.textContent = '';

    if (state.state === 'error') {
        input.classList.add('error');
        feedback.classList.add('error');
        feedback.textContent = state.errors.join('. ');
        input.value = '';
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


    if (!linkRSS.trim()) {
        state.errors = [];
        state.errors.push('Не должно быть пустым');
        state.state = 'error';
        state.button = 'noAktive';
        render();
        return;
    }
    else if (state.feeds.includes(linkRSS) ) {
        state.errors = [];
        state.errors.push('Такой URL уже есть');
        state.state = 'error';
        state.button = 'noAktive';
        render();
        return;
    }
    else if (linkRSS.length < 6) { //linkRSS.length < 6
        state.errors = [];
        state.errors.push('Короткий URL');
        state.state = 'error';
        state.button = 'noAktive';
        render();
        return;
    }
    else if ((!linkRSS.includes('rss')) && (!linkRSS.endsWith('.xml'))) { 
        state.errors = [];
        state.errors.push('Ссылка должна быть валидным URL');
        state.state = 'error';
        state.button = 'noAktive';
        render();
        return;
    } else if (!feedsCopy(linkRSS)) {
        state.errors = [];
        state.errors.push('Такой URL уже есть');
        state.state = 'error';
        state.button = 'noAktive';
        render();
        return;
    }

    try {
        new URL(linkRSS);
      } catch {
        state.errors.push('Ссылка должна быть валидным URL');
        state.state = 'error';
        state.button = 'noAktive';
        input.classList.add('error');
        render();
        return;
      }

      state.state = 'success';
      render();
      input.value = '';
      input.focus();
      state.feeds.push(linkRSS);
      render();
  }


render();

