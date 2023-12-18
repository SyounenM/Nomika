import { app, database, ref_, set_, get_, update_, push_, goOffline_}  from "../../../../../js/master.js";

// アプリケーションが閉じられたときに呼ばれる処理
window.onbeforeunload = function () {
    // Firebase Realtime Databaseへの接続を切断
    goOffline_(database);
};

// 画面高さ
var background = document.getElementById("background-edit");
var backHeight = 0;


// 高さの変更
function changeHeight() {
    var offsetTop = updateButton.offsetTop;
    console.log(offsetTop);
    backHeight = offsetTop + 500;
    background.style.height = backHeight + "px";
}

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




// 初期画面生成
// グループ名
const groupNameRef = ref_(database, 'groups/' + groupId + '/groupName');
const groupName = document.getElementById("groupNameBox");

get_(groupNameRef)
    .then((snapshot) => {
    if (snapshot.exists()) {
        groupName.value = snapshot.val();
    } else {
        console.log('データが存在しません');
    }
    })
    .catch((error) => {
    console.error('データの取得に失敗:', error);
});

// メンバー
let memberList = [];
let memberDiv = document.getElementById('memberList');
const groupMemberRef = ref_(database, 'groups/' + groupId + '/groupMember');

get_(groupMemberRef)
    .then((snapshot) => {
    if (snapshot.exists()) {
        memberList = snapshot.val();
        console.log(memberList);
        displayMembers();
        changeHeight();
    } else {
        console.log('データが存在しません');
    }
    })
    .catch((error) => {
    console.error('データの取得に失敗:', error);
});

function displayMembers() {
    for (let i = 0; i < memberList.length; i++) {
        let member = memberList[i];
        console.log(member);
        
        let memberSpan = document.createElement("span");
        memberSpan.type = 'text';
        memberSpan.textContent = member;
        memberSpan.style = 'font-size: 25px; height: 50px; background-color:white; margin-right:10px; border: solid 1px black; border-width: 2px; border-radius: 10px; padding: 7px;';
        memberSpan.id = member + "Span";

        let cancelButton = document.createElement('button');
        cancelButton.textContent = "×";
        cancelButton.id = member + 'Cancel';
        cancelButton.style = 'font-size: 15px; position: relative; top: -3px; width: 35px; background-color:white; border: solid 1px black; border-width: 2px; border-radius: 10px; padding: 5px; margin-left: 10px;';

        cancelButton.onclick = function(){
            cancelMember(member);
        };

        memberSpan.appendChild(cancelButton);
        memberDiv.appendChild(memberSpan);
    }
    memberDiv.appendChild(document.createElement('br'));
}


// 編集
function updateGroup(){
    updateGroupName();
    updateMembers();
    alert('編集が完了しました');
    window.location.href = `../group.html?id=${groupId}`;
}

// グループ名編集
function updateGroupName() {
    set_(groupNameRef, groupName.value)
    .then(()=>{
        console.log("データが正常に書き込まれました");
    })
    .catch((error)=>{
        console.error("データの書き込みに失敗しました", error);
    })
}

// メンバー編集
const addButton = document.getElementById("addButton");
const inputMember = document.getElementById("inputMember");

addButton.addEventListener("click", function() {
    if (inputMember.value != "") {
        let member;
        member = inputMember.value;
        inputMember.value = "";
        for (let i = 0; i < member.length; i++) {
            if (memberList[i] == member){
                alert('既に追加されています。同名のメンバーは追加できません。');
                return;
            }
        }
        memberList.push(member);
        console.log(memberList);
        let memberSpan = document.createElement("span");
        memberSpan.type = 'text';
        memberSpan.textContent =  '' + member + '' ;
        memberSpan.style = 'font-size: 25px; height: 50px; background-color:yellow; margin:10px; border: solid 1px black; border-width: 2px; border-radius: 10px; padding: 7px;';
        memberSpan.id = member + "Span";

        let cancelButton = document.createElement('button');
        cancelButton.textContent = "×";
        cancelButton.id = member + 'Cancel';
        cancelButton.style = 'font-size: 15px; position: relative; top: -3px; width: 35px; background-color:white; border: solid 1px black; border-width: 2px; border-radius: 10px; padding: 5px; margin-left: 10px;';
        // cancelButton.style.height = '15px';
        // cancelButton.style.width = '15px';
        // cancelButton.style.offset

        cancelButton.onclick = function(){
            cancelMember(member);
        };

        memberSpan.appendChild(cancelButton)
        memberDiv.appendChild(memberSpan); 

        changeHeight();

    } else {
        alert('メンバー名を入力してください');
    }
});

function cancelMember(member) {
    let colIndex = memberList.indexOf(member);
    memberList.splice(colIndex, 1);
    console.log(memberList);
    let target = document.getElementById(member + "Span");
    target.remove();
}

function updateMembers() {
    if (memberList.length != 0) {
        const membersRef = ref_(database, 'groups/' + groupId + '/groupMember');
        set_(membersRef, memberList)
        .then(()=>{
            console.log("データが正常に書き込まれました");
            console.log(memberList);
        })
        .catch((error)=>{
            console.error("データの書き込みに失敗しました", error);
        })
    } else {
        alert('メンバーを追加してください');
    }
}


// 更新ボタンで編集内容を反映
updateButton.onclick = updateGroup;