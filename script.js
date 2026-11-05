// === СЕКРЕТ (GOD MODE) ===
let clicks = 0;
function activateGodMode() {
    clicks++;
    if (clicks === 5) {
        document.body.classList.add('god-mode');
        alert("⚠️ СЕКРЕТНЫЙ РЕЖИМ АКТИВИРОВАН ⚠️");
    }
}

// === ДАННЫЕ (Пока просто в коде) ===
const marvelList = [
    { name: "Avengers", desc: "Сбор героев Земли." },
    { name: "Spider-Man", desc: "Ваш дружелюбный сосед." },
    { name: "Iron Man", desc: "Гений в костюме." }
];

// Если мы на странице marvel.html, отрисовываем карточки
const grid = document.getElementById('fandomGrid');
if (grid && typeof marvelList !== 'undefined') {
    grid.innerHTML = '';
    marvelList.forEach(item => {
        const card = document.createElement('div');
        card.className = 'fandom-card';
        card.innerHTML = `<h3>${item.name}</h3><p>${item.desc}</p>`;
        grid.appendChild(card);
    });
}
