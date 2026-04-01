import './style.css';

const app = document.querySelector('#app');

app.innerHTML = `
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <h1 class="mb-4">RSS Reader</h1>
        <p class="text-muted">
          Начните читать RSS сегодня! Это легко, это красиво.
        </p>

        <form id="rss-form" class="row g-2 mt-4">
          <div class="col-12 col-md-9">
            <input
              type="text"
              name="url"
              class="form-control"
              placeholder="Ссылка на RSS"
              required
            >
          </div>
          <div class="col-12 col-md-3">
            <button type="submit" class="btn btn-primary w-100">
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
`;
