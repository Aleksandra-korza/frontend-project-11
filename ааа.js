const updateFeeds = () => {
    const promises = state.feeds.map((feed) => {
        const url = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(feed.link)}&v=${Date.now()}`; 
        // после ? в URL — это параметры запроса, а не путь к странице
        // encodeURIComponent(...) - кодирование - замена знаков https://site.com/rss.xml -> https://site.com/rss.xml
        // Date.now() -  Каждый запрос получает уникальный URL: /api/rss?v=171 -> /api/rss?v=172, что бы не подтягивалась старая кешированная страница, меняем адреса запроса на новый добавляя каждый раз миллисикунды 
        // fetch('https://site.com/api?v=123') === GET /api?v=123 HTTP/1.1 Host: site.com

        return fetch(url) //Promise { <pending> } :  Response object браузер отправляет HTTP GET->сервер отвечает-> браузер создаёт объект Response -> ты читаешь данные через response.json() или response.text() {
            //"contents": "<rss><channel>...</channel></rss>",
            //"status": {
            //  "http_code": 200
            //}
          //}
            .then(res => res.json()) // Когда response будет готов → прочитай JSON → верни объект,
                                        // содержит, превращяет строку в объект  : 
                                        //Response {
                                        //    body: ReadableStream,
                                        //    status: 200,
                                        //    ok: true
                                        //}
            .then(data => {
            const doc = new DOMParser().parseFromString(data.contents, 'text/xml'); // Возьми XML-текст и преврати его в DOM-дерево
            // data.contents = 
                //<rss>
                    //<channel>
                        //<item>
                        //<title>Новость</title>
                        //</item>
                    //</channel>
                    //</rss> 
                    // Стало: (превращаем в дом  дерево с корорым сожно запросы вызывать такие как doc.querySelectorAll('item') )
                        //Document
                        //└── rss
                        //     └── channel
                        //        └── item
            const items = Array.from(doc.querySelectorAll('item'));     // Чтобы получить обычный массив : [itemElement1,itemElement2,itemElement3]     
            const postFromNetwork = items.map(item => ({
                titel: item.querySelector('titel').textContent,
                post: item.querySelector('titel'),
                description: item.querySelector('description').textCountent,
                feedId: feed.id
            }))
            const newPost = postFromNetwork.filter(post => {
                return !state.incomingWeb.some(oldPost.post === post.post);
            })
            if(newPost.length > 0 ) { // если есть новые посты  unshift(x) - как push()  только вначало добавляет а не в конец 
                state.incomingWeb.unshift(...newPost.map(p => ({ ...p, id: Math.random().toString(36).substring(2)}))) // скорируй все поля Р, и создай ключь с именеи Id _ присвой значение рандомное число, переведи его в строку в системе счисления base36 и удали первые два символа => (123).toString(36)=> "3f" => "0.kf83jd" => "kf83jd" , 
            }
            })
            .catch(e => console.error('ошибка', e))

            Promise.all(promises).finally(() => { // вызываю метод алл у объекта Promise и передаю в него массив promises , после чего вызываю метод  finally в который передаю стрелочную функцию , которая вызывает setTimeout которая в свою очередь вызывает updateFeeds каждые 5000 миллисекунд 
                setTimeout(updateFeeds, 5000)
            })

    })
}