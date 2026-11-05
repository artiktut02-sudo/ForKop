import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// 🔑 ТВОИ КЛЮЧИ FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCPpV_CRb4D_BZzSAF2ZBe2lCBm93mepvE",
  authDomain: "forkop-2543b.firebaseapp.com",
  projectId: "forkop-2543b",
  storageBucket: "forkop-2543b.firebasestorage.app",
  messagingSenderId: "55712430637",
  appId: "1:55712430637:web:1349654831623ba4b0d6a4",
  measurementId: "G-TPNS7Z767V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- UI LOGIC ---
const formBtn = document.getElementById('toggleFormBtn');
const formContainer = document.getElementById('addFormContainer');
const submitBtn = document.getElementById('submitBtn');

// Переключение формы
if (formBtn && formContainer) {
    formBtn.addEventListener('click', () => {
        const isHidden = formContainer.style.display === 'none';
        formContainer.style.display = isHidden ? 'block' : 'none';
        formBtn.innerText = isHidden ? '❌ CANCEL' : '➕ ADD NEW FANDOM';
    });
}

// --- MODERATION ---
const badWords = ['badword', 'spam', 'nsfw', 'плохое'];
function isClean(text) {
    if (!text) return true;
    const lower = text.toLowerCase();
    return !badWords.some(word => lower.includes(word));
}

// --- SAVE FUNCTION ---
if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
        console.log("🚀 Сохранение...");
        
        const nameInput = document.getElementById('fName');
        const catInput = document.getElementById('fCat');
        const descInput = document.getElementById('fDesc');
        const imgInput = document.getElementById('fImgUrl');

        const name = nameInput ? nameInput.value.trim() : '';
        const cat = catInput ? catInput.value : 'Anime';
        const desc = descInput ? descInput.value.trim() : '';
        const imgUrl = (imgInput && imgInput.value.trim()) ? imgInput.value.trim() : 'https://placehold.co/300x160/050505/4af626?text=NO+IMAGE';

        if (!name || !desc) {
            alert("⚠️ Please fill Name and Description!");
            return;
        }

        if (!isClean(name) || !isClean(desc)) {
            alert("⛔ Prohibited words detected!");
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerText = "SAVING...";

            await addDoc(collection(db, "fandoms"), {
                name: name,
                category: cat,
                description: desc,
                imgUrl: imgUrl,
                author: "Guest",
                date: new Date()
            });

            alert("✅ Successfully added to ForKop Database!");
            
            // Очистка
            if (nameInput) nameInput.value = '';
            if (descInput) descInput.value = '';
            if (imgInput) imgInput.value = '';
            if (formContainer) formContainer.style.display = 'none';
            if (formBtn) formBtn.innerText = '➕ ADD NEW FANDOM';

        } catch (error) {
            console.error("❌ Firebase Error:", error);
            alert("❌ Error: " + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = "SUBMIT TO DATABASE";
        }
    });
}

// --- LOAD FANDOMS & GENERATE GAME LINKS ---
const grid = document.getElementById('fandomGrid');
if (grid) {
    const q = query(collection(db, "fandoms"), orderBy("date", "desc"));
    
    onSnapshot(q, (snapshot) => {
        grid.innerHTML = '';
        snapshot.forEach(doc => {
            const d = doc.data();
            const card = document.createElement('div');
            card.className = 'fandom-card';
            
            // Генерация ссылки на мини-игру с параметрами
            const gameLink = `play.html?name=${encodeURIComponent(d.name)}&cat=${encodeURIComponent(d.category)}`;

            card.innerHTML = `
                <img src="${d.imgUrl}" class="fandom-img" alt="${d.name}" 
                     onerror="this.onerror=null; this.src='https://placehold.co/300x160/050505/4af626?text=NO+IMAGE';">
                <span style="font-size:0.7rem; background:var(--primary); color:black; padding:2px 6px; border-radius:3px;">${d.category}</span>
                <h3 style="margin:8px 0;">${d.name}</h3>
                <p style="opacity:0.8; font-size:0.9rem;">${d.description}</p>
                <small style="opacity:0.5; display:block; margin-top:10px;">By: ${d.author}</small>
                
                <!-- КНОПКА ИГРЫ -->
                <a href="${gameLink}" class="game-link-btn">🎮 PLAY MINI-GAME</a>
            `;
            grid.appendChild(card);
        });
    }, (error) => {
        console.error("Ошибка загрузки:", error);
        grid.innerHTML = `<p style="color:red; text-align:center;">Error loading data. Check Console.</p>`;
    });
}

// --- GOD MODE SECRET ---
let clicks = 0;
const footer = document.getElementById('secretFooter');
if (footer) {
    footer.addEventListener('click', () => {
        clicks++;
        if (clicks === 5) {
            document.body.classList.add('god-mode');
            alert("⚠️ GOD MODE ACTIVATED ⚠️");
        }
    });
}
