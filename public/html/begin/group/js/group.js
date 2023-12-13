import { app, database, ref_, set_, get_, update_, push_, goOffline_}  from "../../../../js/master.js";
const groupH3 = document.getElementById("groupH3");
const tatekaeButton = document.getElementById("tatekaeButton");
const warikanButton = document.getElementById("warikanButton");
const gameButton = document.getElementById("gameButton");
const editButton = document.getElementById("editButton");
const logo = document.getElementById("logo");
const top = document.getElementById("top");
const home = document.getElementById("home");

const groupId = new URLSearchParams(window.location.search).get('id');
console.log("groupId:" + groupId);
// グループ名を表示
get_(ref_(database,'groups/' + groupId))
    .then((snapshot) => {
    const data = snapshot.val();
    const name = data["groupName"]
    console.log("groupname:" + name);
    groupH3.textContent = "This is " + name;
})
    .catch((error) => {
        console.log("ID:" + groupId);
        console.error("データの読み取りに失敗しました", error);
});


tatekaeButton.href = `./tatekae/tatekae.html?id=${groupId}`;
warikanButton.href = `./warikan/warikan.html?id=${groupId}`;
gameButton.href = `./game/game.html?id=${groupId}`;
editButton.href = `./edit/edit.html?id=${groupId}`;
logo.href = `./group.html?id=${groupId}`;
function showAlert() {
    var result = confirm('注意 グループから抜けることになります');
    if (result){
        top.href = `../../../index.html`;
    }
}
top.onclick = showAlert;
home.href = `./group.html?id=${groupId}`;



// アプリケーションが閉じられたときに呼ばれる処理
window.onbeforeunload = function () {
    // Firebase Realtime Databaseへの接続を切断
    goOffline_(database);
};