Установить NODE.js
https://nodejs.org/en

Новый терминал
node -v
npm -v

Должны установлены быть node и npm

npm install -g @vue/cli

Создание приложения
vue create platform-abiturient

cd platform-abiturient

npm install xlsx

Меняем весь код в файле App.vue в папке src 
на новый код App.vue 



Создание локальной базы
Новый терминал
mkdir server
cd server

npm init -y

npm install express body-parser sqlite3

npm install cors

Создаем файл abiturients.db

Создаем файл server.js 
туда вставляем код из server.js 

В терминале пишем
node server.js

Новый терминал
В терминале пишем
npm run serve