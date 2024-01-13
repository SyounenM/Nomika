// import {database, ref_, set_, get_, update_, push_, goOffline_}  from "../../../../../../js/master.js";

// // アプリケーションが閉じられたときに呼ばれる処理
window.onbeforeunload = function () {
//     // Firebase Realtime Databaseへの接続を切断
    goOffline_(database);
};

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

var texts = [
  "Text 1",
  "Text 2",
  "Text 3",
  "Text 4",
  "Text 5"
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

  if (!cardFlipped) {
    const randomText = getRandomText();
    // カードが裏返っていない場合は表にする
    cardInner.style.transform = "rotateY(180deg)";
    document.getElementById('randomText').textContent = randomText;
    console.log(textHistory)
  } else {
    // カードが裏返っている場合は裏に戻す
    cardInner.style.transform = "rotateY(0deg)";
  }

  cardFlipped = !cardFlipped; // カードの状態を切り替える
});

// texts から指定された要素を削除する関数
function removeFromTexts(text) {
  const index = texts.indexOf(text);
  if (index !== -1) {
    predefinedText.splice(index, 1);
  }
}

// 削除する関数
function rmItem(element) {
  const row = element.closest('tr');
  if (row && row.parentNode.querySelectorAll('tr.item').length > 1) {
    const input = row.querySelector('.input-content');
    const text = input.value;
    row.remove();

    // predefinedText 配列から該当の要素を削除
    const index = texts.indexOf(text);
    if (index !== -1) {
      texts.splice(index, 1);
    }
  }
}

$(document).ready(function() {
  const tableBody = $('#tableBody');
  texts.forEach((text) => {
    const newRow = $('<tr>').addClass('item');
    const nameCell = $('<td>');
    const nameInput = $('<input>').attr({
      type: 'text',
      class: 'name input-content',
      value: text
    });
    nameCell.append(nameInput);

    const deleteButtonCell = $('<td>');
    const deleteButton = $('<button>').attr({
      type: 'button',
      class: 'deleteButton'
    }).text('削除');
    deleteButtonCell.append(deleteButton);

    newRow.append(nameCell, deleteButtonCell);
    tableBody.append(newRow);
  });
});

// 追加ボタンをクリックしたときの処理
$('.add').click(function(){
  var add = '<tr class="item"><td><input type="text" class="name input-content"></td><td><button class="deleteButton" type="button" onclick="rmItem(this)">削除</button></td></tr>';
  $('#table').append(add);
  texts.push('');
  changeHeight()
});

// 削除ボタンをクリックしたときの処理
tableBody.addEventListener('click', function(event) {
  if (event.target.classList.contains('deleteButton')) {
    const row = event.target.closest('tr');
    if (tableBody.childNodes.length > 1) {
      rmItem(row);
    } else {
      alert('最後の要素は削除できません');
    }
    changeHeight()
  }
});

// テキストボックスの内容が変更されたときの処理
tableBody.addEventListener('input', function(event) {
  const target = event.target;
  if (target && target.classList.contains('input-content')) {
    const index = Array.from(tableBody.children).indexOf(target.parentElement.parentElement);
    texts[index] = target.value;
  }
});

// 高さの変更
function changeHeight() {
  const background = document.getElementById("background-topic");
  var offsetTop = back.offsetTop;
  console.log("back height", offsetTop);
  const hisHeight = offsetTop + 600;
  console.log("hisHeight", hisHeight);
  background.style.height = hisHeight + "px";
}