
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
    apiKey: "AIzaSyDy570gn8EFfmfmg0GB74t8N7BXDOSRdf0",
    authDomain: "nomika-7311b.firebaseapp.com",
    projectId: "nomika-7311b",
    storageBucket: "nomika-7311b.appspot.com",
    messagingSenderId: "273662705348",
    appId: "1:273662705348:web:18029e815a39fcb29d9391",
    measurementId: "G-H8B51TR2Y8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
    // .then(()=>{
    //     console.log("appが正常に初期化されました");
    // })
    // .catch((error)=>{
    //     console.error("app初期化の際にエラーが起きました",error);   
    // })

export const analytics = getAnalytics(app);
    // .then(()=>{
    //     console.log("analyticsが正常に取得されました");
    // })
    // .catch((error)=>{
    //     console.error("analytics取得の際にエラーが起きました",error);
    // })

// Realtime Databaseへの参照取得
export const database = getDatabase(app);
    // .then(()=>{
    //     console.log("databaseに正常に接続されました");
    // })
    // .catch((error)=>{
    //     console.error("database接続の際にエラーが起きました",error);
    // })

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

// const dataRef2 = ref(database, "name2");
// // データを書き込む
// update_(dataRef2, {
//     key1: "value1",
//     key2: "value2",
//     // 他のデータ
// })
//     .then(() => {
//     console.log("データが正常に書き込まれました");
//     })
//     .catch((error) => {
//     console.error("データの書き込みに失敗しました", error);
//     });

export function showAlert() {
    alert('注意 グループから抜けることになります');
}