## запуск локального хоста 
npm run dev

## добавляем и пушим обновления на GitHub
git add .
git commit -m "MVC done"
git push

## запускаем линтер 
npx eslint --no-config-lookup --config eslint.config.js . --fix
npx eslint --no-config-lookup --config eslint.config.js .