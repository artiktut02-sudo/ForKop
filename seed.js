// Скопируй этот код, открой консоль на сайте (F12) и вставь его туда.
// Он добавит 200 фэндомов в твою базу данных!

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCPpV_CRb4D_BZzSAF2ZBe2lCBm93mepvE",
  authDomain: "forkop-2543b.firebaseapp.com",
  projectId: "forkop-2543b",
  storageBucket: "forkop-2543b.firebasestorage.app",
  messagingSenderId: "55712430637",
  appId: "1:55712430637:web:1349654831623ba4b0d6a4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const categories = ["Anime", "Games", "Marvel", "Movies", "YouTube"];
const prefixes = ["Super", "Mega", "Dark", "Cyber", "Neo", "Ultra", "Retro", "Space"];
const nouns = ["Ninja", "Warrior", "Racer", "Mage", "Pilot", "Hero", "Villain", "Explorer"];

async function seedDatabase() {
    console.log("🚀 Starting seeding...");
    for (let i = 0; i < 200; i++) {
        const cat = categories[Math.floor(Math.random() * categories.length)];
        const name = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]} #${i+1}`;
        
        await addDoc(collection(db, "fandoms"), {
            name: name,
            category: cat,
            description: `This is an auto-generated entry for testing ForKop v1.0. Category: ${cat}.`,
            imgUrl: "https://placehold.co/300x160/050505/4af626?text=FANDOM",
            author: "System",
            date: new Date()
        });
    }
    console.log("✅ 200 Fandoms added successfully!");
}

seedDatabase();
