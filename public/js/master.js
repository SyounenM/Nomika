<<<<<<< HEAD
window.onload = function() {
    // Webページの横幅を取得
    var pageWidth = window.parent.screen.width;

    // 画面の横幅をWebページの横幅に合わせる
    document.documentElement.style.width = pageWidth + 'px';
    document.body.style.width = pageWidth + 'px';
};
=======

window.onload = function() {
    // Webページの横幅を取得
    var pageWidth = window.parent.screen.width;
    console.log(1);
    // 画面の横幅をWebページの横幅に合わせる
    document.documentElement.style.width = pageWidth + 'px';
    document.body.style.width = pageWidth + 'px';              
};


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
import { getDatabase, ref, get, set, update, push} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
    // Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC9zhxt23j7ynVelItKR-GOkszacgD1m2s",
    authDomain: "nomika-f699e.firebaseapp.com",
    projectId: "nomika-f699e",
    storageBucket: "nomika-f699e.appspot.com",
    messagingSenderId: "726205228358",
    appId: "1:726205228358:web:3666f6a80b0c82e462b147",
    measurementId: "G-Y4V81T4CBH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
// Realtime Databaseへの参照取得
export const database = getDatabase(app);
export function ref_(database, path) {
    return ref(database, path);
}
export function get_(ref) {
    return get(ref);
}
export function set_(ref, json) {
    return set(ref, json);
}
export function update_(ref, json) {
    return update(ref, json);
}
export function push_(ref) {
    return push(ref);
}
//使用例
// console.log(1);

// const dataRef = ref(database, "message");
// get_(dataRef)
//     .then((snapshot) => {
//     const data = snapshot.val();
//     console.log(data);
// })
// .catch((error) => {
// console.error("データの読み取りに失敗しました", error);
// });

const dataRef2 = ref(database, "name2");
// データを書き込む
update_(dataRef2, {
    key1: "value1",
    key2: "value2",
    // 他のデータ
})
    .then(() => {
    console.log("データが正常に書き込まれました");
    })
    .catch((error) => {
    console.error("データの書き込みに失敗しました", error);
    });

>>>>>>> origin/backend
