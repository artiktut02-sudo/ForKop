import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

// 🔑 ТВОИ КЛЮЧИ УЖЕ ВСТАВЛЕНЫ СЮДА
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
const storage = getStorage(app);

// --- UI LOGIC ---
const formBtn = document.getElementById('toggleFormBtn');
const formContainer = document.getElementById('addFormContainer');
const imgInput = document.getElementById('fImg');
const imgPreview = document.getElementById('imgPreview');

formBtn.addEventListener('click', () => {
    const isHidden = formContainer.style.display === 'none';
    formContainer.style.display = isHidden ? 'block' : 'none';
    formBtn.innerText = isHidden ? '❌ CANCEL' : '➕ ADD NEW FANDOM';
});

imgInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            imgPreview.innerHTML = `<img src="${ev.target.result}" style="max-height:100px; border:1px solid var(--primary);">`;
        };
        reader.readAsDataURL(file);
    }
});

// --- MODERATION ---
const badWords = ['badword', 'spam', 'nsfw', 'плохое'];
function isClean(text) {
    const lower = text.toLowerCase();
    return !badWords.some(word => lower.includes(word));
}

// --- UPLOAD FUNCTION ---
window.uploadFandom = async function() {
    const name = document.getElementById('fName').value;
    const cat = document.getElementById('fCat').value;
    const desc = document.getElementById('fDesc').value;
    const file = imgInput.files[0];

    if (!name || !desc || !file) {
        alert("⚠️ Please fill all fields and upload an image!");
        return;
    }

    if (!isClean(name) || !isClean(desc)) {
        alert("⛔ Prohibited words detected! Submission blocked.");
        return;
    }

    try {
        formBtn.disabled = true;
        formBtn.innerText = "UPLOADING...";

        // 1. Upload Image to Storage
        const storageRef = ref(storage, 'fandoms/' + Date.now() + '_' + file.name);
        await uploadBytes(storageRef, file);
        const imgUrl = await getDownloadURL(storageRef);

        // 2. Save Metadata to Firestore
        await addDoc(collection(db, "fandoms"), {
            name: name,
            category: cat,
            description: desc,
            imgUrl: imgUrl,
            author: "Guest",
            date: new Date()
        });

        alert("✅ Successfully added to ForKop Database!");
        
        // Reset Form
        document.getElementById('fName').value = '';
        document.getElementById('fDesc').value = '';
        imgInput.value = '';
        imgPreview.innerHTML = '';
        formContainer.style.display = 'none';
        formBtn.innerText = '➕ ADD NEW FANDOM';

    } catch (error) {
        console.error(error);
        alert("❌ Error uploading. Check console for details.");
    } finally {
        formBtn.disabled = false;
    }
};

// --- LOAD FANDOMS (REAL-TIME) ---
const grid = document.getElementById('fandomGrid');
if (grid) {
    const q = query(collection(db, "fandoms"), orderBy("date", "desc"));

    onSnapshot(q, (snapshot) => {
        grid.innerHTML = '';
        snapshot.forEach(doc => {
            const d = doc.data();
            const card = document.createElement('div');
            card.className = 'fandom-card';
            card.innerHTML = `
                <img src="${d.imgUrl}" class="fandom-img" alt="${d.name}" onerror="this.src='https://via.placeholder.com/300x160?text=No+Image'">
                <span style="font-size:0.7rem; background:var(--primary); color:black; padding:2px 6px; border-radius:3px;">${d.category}</span>
                <h3 style="margin:8px 0;">${d.name}</h3>
                <p style="opacity:0.8; font-size:0.9rem;">${d.description}</p>
                <small style="opacity:0.5; display:block; margin-top:10px;">By: ${d.author}</small>
            `;
            grid.appendChild(card);
        });
    });
}

// --- GOD MODE SECRET ---
let clicks = 0;
document.getElementById('secretFooter').addEventListener('click', () => {
    clicks++;
    if (clicks === 5) {
        document.body.classList.add('god-mode');
        alert("⚠️ GOD MODE ACTIVATED ⚠️");
    }
});
