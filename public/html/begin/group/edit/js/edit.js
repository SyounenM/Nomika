import { app, database, ref_, set_, get_, update_, push_, goOffline_}  from "../../../../../js/master.js";

// アプリケーションが閉じられたときに呼ばれる処理
window.onbeforeunload = function () {
    // Firebase Realtime Databaseへの接続を切断
    goOffline_(database);
};


const groupId = new URLSearchParams(window.location.search).get('id');
const logo = document.getElementById("logo");
const topButton = document.getElementById("top");
const home = document.getElementById("home");
const cancelButton = document.getElementById("cancel");
const updateButton = document.getElementById("update");

logo.href = `../group.html?id=${groupId}`;
function showAlert() {
    var result = confirm('注意 グループから抜けることになります');
    if (result){
        topButton.href = `../../../../index.html`;
    }
}
topButton.onclick = showAlert;
home.href = `../group.html?id=${groupId}`;
cancelButton.href = `../group.html?id=${groupId}`;
updateButton.href = `../group.html?id=${groupId}`;




// 定数（データベースで共有した情報)
let groupName = "飲み会"
let memberList = ["秀島", "川崎", "佐々木", "福田", "松島"];

let memberTable = document.getElementById('memberTable');
let memberListDiv = document.getElementById('memberList');

function viewBuilder() {
    let groupNameBox = document.getElementById('groupNameBox');
    groupNameBox.value = groupName; 
    for (let i=0 ; i<memberList.length; i++) {
        createMember(memberList[i]);
    }
    //完成したtrをtableに追加
    memberTable.appendChild(tr);  
}


function addMember() {
    let newMember = document.getElementById('newMember').value;
    memberList.push(newMember);
    createMember(newMember);
    console.log(memberList);
}


function createMember(member) {
    // メンバー名
    let memberSpan = document.createElement("span");  //tdに何か追加。
    memberSpan.type = 'text';
    memberSpan.textContent =  ''+ member + '' ;
    memberSpan.style = 'background-color:white; margin-right:10px; border: solid 1px black; border-width: 2px; border-radius: 10px; padding: 5px;';
    memberSpan.id = member + "Span";

    let cancelButton = document.createElement('button');
    cancelButton.textContent = "×";
    cancelButton.id = member + 'Cancel';
    cancelButton.style = 'font-size: 15px; position: relative; top: -3px; width: 30px; background-color:white; border: solid 1px black; border-width: 2px; border-radius: 10px; padding: 5px; margin-left: 10px;';
    // cancelButton.style.height = '15px';
    // cancelButton.style.width = '15px';
    // cancelButton.style.offset

    cancelButton.onclick = function(){
        cancelMember(member);
    };

    memberSpan.appendChild(cancelButton)
    memberListDiv.appendChild(memberSpan);  
}

function cancelMember(member) {
    console.log(memberList);
    let colIndex = memberList.indexOf(member);
    memberList.splice(colIndex, 1);
    console.log(memberList);
    let target = document.getElementById(member + "Span");
    target.remove();
}

function update(params) {
    
}

function cancel(params) {
    
}

viewBuilder();