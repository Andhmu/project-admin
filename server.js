const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('abiturients.db');

app.use(bodyParser.json());
app.use(cors());

// Маршрут для добавления данных
app.post('/submit', (req, res) => {
  const { lastName, firstName, middleName, birthDate } = req.body;

  if (!lastName || !firstName || !birthDate) {
    return res.status(400).json({ message: 'Все обязательные поля должны быть заполнены' });
  }

  const query = `
    INSERT INTO abiturients (lastName, firstName, middleName, birthDate)
    VALUES (?, ?, ?, ?)
  `;
  db.run(query, [lastName, firstName, middleName, birthDate], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при сохранении данных', error: err.message });
    }

    res.status(200).json({ message: 'Данные успешно сохранены', id: this.lastID });
  });
});

// Маршрут для входа администратора
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'pass') {
    res.status(200).json({ message: 'Успешный вход', token: 'admin-token' });
  } else {
    res.status(401).json({ message: 'Неверные логин или пароль' });
  }
});

// Маршрут для получения всех данных (только для администратора)
app.get('/data', (req, res) => {
  const token = req.headers.authorization;

  if (token !== 'admin-token') {
    return res.status(403).json({ message: 'Доступ запрещен' });
  }

  const query = 'SELECT * FROM abiturients';
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: 'Ошибка при получении данных', error: err.message });
      return;
    }

    res.json(rows);
  });
});

app.get('/', (req, res) => {
    const query = 'SELECT * FROM abiturients';
  
    db.all(query, [], (err, rows) => {
      if (err) {
        res.status(500).json({ message: 'Ошибка при получении данных', error: err.message });
        return;
      }
  
      res.json(rows);
    });
  });
  
// Запуск сервера
app.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000');
});

