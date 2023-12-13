// import { app, database, ref_, set_, get_, update_, push_, goOffline_}  from "../../../../../../js/master.js";

// // アプリケーションが閉じられたときに呼ばれる処理
// window.onbeforeunload = function () {
//     // Firebase Realtime Databaseへの接続を切断
//     goOffline_(database);
// };


const groupId = new URLSearchParams(window.location.search).get('id');
const logo = document.getElementById("logo");
const topButton = document.getElementById("top");
const home = document.getElementById("home");
const back = document.getElementById("back");

logo.href = `../../group.html?id=${groupId}`;
function showAlert() {
  var result = confirm('注意 グループから抜けることになります');
  if (result){
      topButton.href = `../../../../../index.html`;
  }
}
topButton.onclick = showAlert;
home.href = `../../group.html?id=${groupId}`;
back.href = `../game.html?id=${groupId}`;

// import {showAlert}  from "../../../../../../js/master.js";

// const topicButton = document.getElementById("topic-button");
// const topic_list = ["貧乳？巨乳？","topic2","topic3"];
// const result = document.getElementById("result");

// function topic() {
//     const r = Math.random();
//     if (r < 0.2) {
//         result.textContent = topic_list[0];
//         result.style.color = "red";
//     } else if (r < 0.7) {
//         result.textContent = topic_list[1];
//         result.style.color = "black";
//     }
//     else {
//         result.textContent = topic_list[2];
//         result.style.color = "blue";
//     }
// }
// topicButton.onclick = topic;


// const texts = [
//     "貧乳？巨乳？",
//     "Text 2",
//     "Text 3",
//     // Add more texts as needed
//   ];
  
// let cardFlipped = false;

// function getRandomText() {
//   const randomIndex = Math.floor(Math.random() * texts.length);
//   return texts[randomIndex];
// }

// document.querySelector('.card').addEventListener('click', function() {
//   const cardInner = document.querySelector('.card-inner');
//   const randomText = getRandomText();

//   if (cardFlipped) {
//     // 裏返していたら表に戻す
//     cardInner.style.transform = "rotateY(0deg)";
//     document.getElementById('randomText').textContent = "";
//   } else {
//     // 表から裏に回転してテキストを表示
//     cardInner.style.transform = "rotateY(180deg)";
//     document.getElementById('randomText').textContent = randomText;
//   }

//   // カードの状態を反転
//   cardFlipped = !cardFlipped;
// });

const texts = [
  "Text 1",
  "Text 2",
  "Text 3",
  "Text 4",
  "Text 5",
  "Text 6",
  "Text 7",
  "Text 8",
  "Text 9",
  "Text 10"
  // Add more texts as needed
];

let textHistory = []; // 表示したテキストの履歴を保持する配列
let textIndex = -1; // 最初はインデックス -1 で開始

let cardFlipped = false; // カードが裏返っているかどうかを管理する変数

function getRandomText() {
  let availableTexts = texts.filter((_, index) => !textHistory.includes(index));

  // すべてのテキストが表示された後は履歴をリセット
  if (availableTexts.length === 0) {
    textHistory = [];
    availableTexts = texts;
  }

  const randomIndex = Math.floor(Math.random() * availableTexts.length);
  const selectedText = availableTexts[randomIndex];
  const selectedTextIndex = texts.indexOf(selectedText);
  textHistory.push(selectedTextIndex); // テキストを履歴に追加
  return selectedText;
}

// ページ読み込み時にtextHistoryをリセットする
window.addEventListener('load', function() {
  textHistory = [];
});

document.querySelector('.card').addEventListener('click', function() {
  const cardInner = document.querySelector('.card-inner');
  const randomText = getRandomText();

  if (!cardFlipped) {
    // カードが裏返っていない場合は表にする
    cardInner.style.transform = "rotateY(180deg)";
    document.getElementById('randomText').textContent = randomText;
  } else {
    // カードが裏返っている場合は裏に戻す
    cardInner.style.transform = "rotateY(0deg)";
  }

  cardFlipped = !cardFlipped; // カードの状態を切り替える
});


// Path: top/html/begin/group/game/topic/js/topic.js