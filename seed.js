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

// Генератор имен для 200+ фэндомов
const animes = ["Naruto", "One Piece", "Bleach", "AOT", "JJK", "Demon Slayer", "DBZ", "Hunter x Hunter"];
const games = ["Minecraft", "Roblox", "GTA", "Fortnite", "Valorant", "CS2", "Dota 2", "League of Legends"];
const marvels = ["Iron Man", "Spider-Man", "Thor", "Hulk", "Captain America", "Black Widow", "Doctor Strange"];
const movies = ["Matrix", "Star Wars", "Lord of Rings", "Avatar", "Inception", "Interstellar"];

async function seedMassiveDatabase() {
    console.log("🚀 Seeding 200+ Fandoms...");
    
    for(let i=0; i<210; i++) {
        let cat, name;
        const rand = Math.random();
        
        if(rand < 0.3) { cat="Anime"; name=animes[i%animes.length] + " " + (i+1); }
        else if(rand < 0.6) { cat="Games"; name=games[i%games.length] + " " + (i+1); }
        else if(rand < 0.8) { cat="Marvel"; name=marvels[i%marvels.length] + " " + (i+1); }
        else { cat="Movies"; name=movies[i%movies.length] + " " + (i+1); }

        await addDoc(collection(db, "fandoms"), {
            name: name,
            category: cat,
            description: `Official mini-game for ${name}. Can you beat the high score?`,
            imgUrl: `https://placehold.co/300x160/050505/4af626?text=${cat.toUpperCase()}`,
            author: "System",
            date: new Date()
        });
    }
    console.log("✅ DONE! 210 Fandoms with Games added.");
}

seedMassiveDatabase();
