// import { app, database, ref_, set_, get_, update_, push_, goOffline_}  from "../../../../../js/master.js";

// // アプリケーションが閉じられたときに呼ばれる処理
// window.onbeforeunload = function () {
//     // Firebase Realtime Databaseへの接続を切断
//     goOffline_(database);
// };



const groupId = new URLSearchParams(window.location.search).get('id');
const icon = document.getElementById("icon");
const logo = document.getElementById("logo");
const topButton = document.getElementById("top");
const home = document.getElementById("home");
const roulette = document.getElementById("roulette");
const topic = document.getElementById("topic");
const back = document.getElementById("back");

icon.href = `../group.html?id=${groupId}`;
logo.href = `../group.html?id=${groupId}`;
function showAlert() {
    var result = confirm('注意 グループから抜けることになります');
    if (result){
        topButton.href = `../../../../index.html`;
    }
}
topButton.onclick = showAlert;
home.href = `../group.html?id=${groupId}`;
roulette.href = `./roulette/roulette.html?id=${groupId}`;
topic.href = `./topic/topic.html?id=${groupId}`;
back.href = `../group.html?id=${groupId}`;

function changeFooter(){
    const footer = document.getElementById("footer");
    console.log("footer", footer.offsetWidth);
    var viewportWidth = window.innerWidth;
    footer.style.width = viewportWidth + 10 + "px";
    console.log("footer", footer.offsetWidth);
}

changeFooter();