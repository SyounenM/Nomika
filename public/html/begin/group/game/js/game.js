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

document.getElementById('contact').addEventListener('click', function() {
    scrollToBottom();
});

// スクロールが滑らかに動くようにする関数
function scrollToBottom() {
    const startPosition = window.scrollY;
    const targetPosition = document.body.scrollHeight - window.innerHeight;
    const distance = targetPosition - startPosition;
    const duration = 1000; // アニメーションの時間（ミリ秒）

    let startTime;

    function scrollAnimation(currentTime) {
        if (startTime === undefined) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));

        if (timeElapsed < duration) {
            requestAnimationFrame(scrollAnimation);
        }
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t ** 3 : 1 - ((-2 * t + 2) ** 3) / 2;
    }

    requestAnimationFrame(scrollAnimation);
}