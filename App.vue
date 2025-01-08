<template>
  <div id="app">
    <div v-if="!isAdmin">
      <!-- Форма для абитуриентов -->
      <h2>Форма для абитуриентов</h2>
      <form @submit.prevent="submitForm">
        <input type="text" v-model="form.lastName" placeholder="Фамилия" required />
        <input type="text" v-model="form.firstName" placeholder="Имя" required />
        <input type="text" v-model="form.middleName" placeholder="Отчество" />
        <input type="date" v-model="form.birthDate" required />
        <button type="submit">Отправить</button>
      </form>
      <p v-if="formMessage" :style="{ color: formMessageColor }">{{ formMessage }}</p>

      <hr />

      <!-- Вход администратора -->
      <h2>Вход администратора</h2>
      <form @submit.prevent="login">
        <input type="text" v-model="adminLogin" placeholder="Логин" required />
        <input type="password" v-model="adminPassword" placeholder="Пароль" required />
        <button type="submit">Войти</button>
      </form>
      <p v-if="loginError" style="color: red;">{{ loginError }}</p>
    </div>

    <div v-else>
      <!-- Таблица данных для администратора -->
      <h2>Данные абитуриентов</h2>
      <button @click="logout">Выйти</button>
      <button @click="downloadExcel">Скачать Excel</button>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Фамилия</th>
            <th>Имя</th>
            <th>Отчество</th>
            <th>Дата рождения</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in data" :key="entry.id">
            <td>{{ entry.id }}</td>
            <td>{{ entry.lastName }}</td>
            <td>{{ entry.firstName }}</td>
            <td>{{ entry.middleName }}</td>
            <td>{{ entry.birthDate }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as XLSX from 'xlsx';

export default {
  data() {
    return {
      // Форма для абитуриентов
      form: {
        lastName: '',
        firstName: '',
        middleName: '',
        birthDate: '',
      },
      formMessage: '',
      formMessageColor: 'green',

      // Авторизация администратора
      isAdmin: false,
      adminLogin: '',
      adminPassword: '',
      loginError: '',

      // Данные для администратора
      data: [],
    };
  },
  methods: {
    // Отправка формы абитуриента
    async submitForm() {
      try {
        const response = await fetch('http://localhost:3000/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.form),
        });

        if (!response.ok) {
          throw new Error('Ошибка при отправке данных');
        }

        this.formMessage = 'Данные успешно отправлены';
        this.formMessageColor = 'green';
        this.form = { lastName: '', firstName: '', middleName: '', birthDate: '' };
      } catch (error) {
        this.formMessage = 'Ошибка: ' + error.message;
        this.formMessageColor = 'red';
      }
    },

    // Вход администратора
    async login() {
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.adminLogin,
            password: this.adminPassword,
          }),
        });

        if (!response.ok) {
          const result = await response.json();
          this.loginError = result.message || 'Ошибка входа';
          return;
        }

        const result = await response.json();
        this.isAdmin = true;
        this.loginError = '';
        await this.fetchData();
      } catch (error) {
        this.loginError = 'Ошибка подключения к серверу';
      }
    },

    // Получение данных абитуриентов
    async fetchData() {
      try {
        const response = await fetch('http://localhost:3000/data', {
          headers: {
            Authorization: 'admin-token',
          },
        });

        if (!response.ok) {
          throw new Error('Ошибка получения данных');
        }

        this.data = await response.json();
      } catch (error) {
        console.error('Ошибка:', error);
      }
    },

    // Выход администратора
    logout() {
      this.isAdmin = false;
      this.adminLogin = '';
      this.adminPassword = '';
      this.data = [];
    },

    // Скачивание данных в формате Excel
    downloadExcel() {
      const worksheet = XLSX.utils.json_to_sheet(this.data); // Конвертация данных в формат таблицы
      const workbook = XLSX.utils.book_new(); // Создание новой книги Excel
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Абитуриенты'); // Добавление листа

      // Генерация и сохранение файла
      XLSX.writeFile(workbook, 'Абитуриенты.xlsx');
    },
  },
};
</script>
