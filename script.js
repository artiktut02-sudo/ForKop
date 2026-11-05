// Импортируем необходимые модули Firebase из CDN
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// 1. Настройка подключения к твоему проекту forkop-2543b
const firebaseConfig = window.__firebase_config || {
  apiKey: "YOUR_API_KEY", // Замени на свой web API key, если не используется глобальный window.__firebase_config
  authDomain: "forkop-2543b.firebaseapp.com",
  projectId: "forkop-2543b",
  storageBucket: "forkop-2543b.firebasestorage.app",
  messagingSenderId: "55712430637",
  appId: "YOUR_APP_ID" // Замени на свой App ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. Ссылка на коллекцию 'fandoms' (создается автоматически при первой записи)
const fandomsCollection = collection(db, 'fandoms');

// Список запрещенных слов для авто-модерации
const forbiddenWords = ['плохое', 'bad', 'spam'];

function isSpam(text) {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return forbiddenWords.some(word => lowerText.includes(word));
}

// Вспомогательная функция защиты от XSS
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// 3. Функция добавления нового фэндома с модерацией (4) и автором Guest (6)
export async function addFandom(name, category, desc) {
  if (isSpam(name) || isSpam(desc)) {
    alert("Запись содержит недопустимые слова ('плохое', 'bad', 'spam') и не будет сохранена!");
    return;
  }

  try {
    await addDoc(fandomsCollection, {
      name: name,
      category: category,
      description: desc,
      author: 'Guest', 
      createdAt: new Date()
    });
    console.log("Фэндом успешно добавлен!");
  } catch (error) {
    console.error("Ошибка добавления:", error);
  }
}

// 5. Функция отображения всех фэндомов в реальном времени
export function loadFandoms() {
  const grid = document.getElementById('allFandomsGrid');
  if (!grid) return;

  // Запрос с сортировкой: новые фэндомы будут в начале
  const q = query(fandomsCollection, orderBy('createdAt', 'desc'));

  onSnapshot(q, (snapshot) => {
    grid.innerHTML = ''; // Очищаем старую сетку

    snapshot.forEach((doc) => {
      const fandom = doc.data();
      const card = document.createElement('div');
      card.className = 'fandom-card';
      card.innerHTML = `
        <h3>${escapeHtml(fandom.name)}</h3>
        <p><strong>Категория:</strong> ${escapeHtml(fandom.category)}</p>
        <p>${escapeHtml(fandom.description)}</p>
        <small>Автор: ${escapeHtml(fandom.author)}</small>
      `;
      grid.appendChild(card);
    });
  });
}

// Экспортируем функции в объект window, чтобы их можно было вызывать из HTML
window.addFandom = addFandom;
window.loadFandoms = loadFandoms;

// Инициализируем загрузку при старте страницы
document.addEventListener('DOMContentLoaded', loadFandoms);
