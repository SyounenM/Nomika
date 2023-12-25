import {database, ref_, set_, get_, update_, push_, goOffline_}  from "../../../../js/master.js";
const groupH3 = document.getElementById("groupH3");
const tatekaeButton = document.getElementById("tatekaeButton");
const warikanButton = document.getElementById("warikanButton");
const gameButton = document.getElementById("gameButton");
const editButton = document.getElementById("editButton");
const logo = document.getElementById("logo");
const top = document.getElementById("top");
const home = document.getElementById("home");

// 画面高さ
var dispScope = document.getElementById("result-group");
var background = document.getElementById("background-group");
var dispHeight = 300;
let resTextHeight = 0;


const groupId = new URLSearchParams(window.location.search).get('id');
console.log("groupId:" + groupId);
// グループ名を表示
get_(ref_(database,'groups/' + groupId))
    .then((snapshot) => {
    const data = snapshot.val();
    const name = data["groupName"]
    console.log("groupname:" + name);
    groupH3.textContent = "グループ名 : " + name;
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

// 結果表示用 //////////////////////////////////////////////////////

let memberList = [];

// データベースへの参照
let groupRef = ref_(database,'groups/' + groupId);
let historyRef = ref_(database, 'groups/' + groupId + '/history');

let historyList = [];
let balanceList = [] ;
let resultList = [];

// データベースから情報を取得
function getGroupInfo() {
    return new Promise((resolve, reject) => {
        get_(groupRef)
            .then((snapshot) => {
                let data = snapshot.val();
                console.log(data);
                memberList = data["groupMember"];
                console.log("memberList:" + memberList);
                resolve(); // ここでプロミスを解決
            })
            .catch((error) => {
                console.log("ID:" + groupId);
                console.error("グループ情報の読み取りに失敗しました", error);
                reject(error); // エラーの場合はプロミスを拒否
            });
    });
}


function getHistory() {
    return new Promise((resolve, reject) => {
        get_(historyRef)
            .then((snapshot) => {
                let history = snapshot.val();
                historyList = Object.values(history);
                // historyList = historyData.map(item => item.data);
                console.log("historyList");
                console.log("historyList", historyList);
                resolve();
            })
            .catch((error) => {
                console.error("履歴の読み取りに失敗しました", error);
                dispScope.style.display = "none";
                reject(error);
            });
    });
}

function initializeBalanceList() {
    for ( const member of memberList ) {
        balanceList.push({"name": member, "balance": 0});
    }
}

function calculateBalance() {
    for (var i = 0; i < historyList.length; i++) {
        console.log("historyList[", i, "]", historyList[i].slice(1));
        for( const { creditor, amount, debtor } of historyList[i].slice(1) ) {
            let creditorObject = balanceList.find(memberObj => memberObj.name === creditor);
            let debtorObject = balanceList.find(memberObj => memberObj.name === debtor);
            if (creditorObject) {
                creditorObject.balance += parseInt(amount);
            }
            if (debtorObject) {
                debtorObject.balance -= parseInt(amount)
            }
        }
    }
}

function calculation(liquidation = []) {
    balanceList.sort((a, b) => b.balance - a.balance);
    let creditor = balanceList[0];
    let debtor = balanceList[balanceList.length - 1];

    let amount = Math.min(creditor.balance, Math.abs(debtor.balance));

    if (amount === 0) {
        return { balanceList, liquidation };
    }

    // Perform the liquidation between creditor and debtor, and make a recursive call
    creditor.balance -= amount;
    debtor.balance += amount;

    liquidation.push({
        debtor: debtor.name,
        creditor: creditor.name,
        amount: amount
    });
    return calculation(liquidation);
}

function mainCalculation() {
    console.log('Initial Balances:');
    balanceList.forEach(balanceList => {
        console.log(`${balanceList.name}: ${balanceList.balance}`);
    });

    // Perform the liquidation
    let result = calculation();

    // Display the liquidation amounts
    console.log('-----------------');
    console.log('Liquidation Amounts:');
    result.liquidation.forEach(l => {
        console.log(`${l.debtor} -> ${l.creditor}: ${parseInt(l.amount)}`);
    });

    // Display the remaining balances after liquidation
    console.log('-----------------');
    console.log('Remaining Balances:');
    result.balanceList.forEach(p => {
        console.log(`${p.name}: ${parseInt(p.balance)}`);
    });

    // Display the offset amount
    console.log('-----------------');
    let total = result.balanceList.reduce((acc, p) => acc + p.balance, 0);
    console.log(`Offset Amount: ${parseInt(total)}`);
    resultList = result.liquidation
}

function showResult() {
    var res = document.getElementById("result");
    console.log("height: " + dispHeight);
    res.innerHTML = ""; // 以前の結果をクリア
    for (const obj of resultList) {
        // 各結果を表示
        res.innerHTML += `<div class="result">${obj.debtor} → ${obj.creditor} : ${obj.amount}円</div>`;
        dispHeight += 60;
    }
    dispScope.style.height = dispHeight + "px";
}

function showMembers() {
    for (let member of memberList) {
        let memberDiv = document.getElementById('member');
        let memberSpan = document.createElement('span');
        memberSpan.textContent = member;
        memberSpan.id = member + 'Span';
        memberSpan.style = 'background-color: white; margin-right:10px; border: solid 1px black; border-width: 2px; border-radius: 10px; padding: 3px;';
        // memberSpan.style.border = 'solid'
        memberDiv.appendChild(memberSpan);
        dispHeight += 42; //表示部分高さの変更
    }
    let lastMember = document.getElementById(memberList[memberList.length - 1] + 'Span');
    console.log("lastMemberHeight", lastMember.offsetTop);
    resTextHeight = lastMember.offsetTop + 100;
}

function showHistory() {
    var historyGroup = document.getElementById("history-group");
    let method;
    console.log(historyList);
    for (var i = 0; i < historyList.length; i++) {
        console.log("historyList[", i, "]", historyList[i][0]);
        const obj = historyList[i][0]
        method = obj.method
        // let his;
        // 各結果を表示
        if (i == historyList.length - 1) {
            historyGroup.innerHTML += `<button id="history-last" class="history">${obj.content} : ${obj.amount}円</a>`;
            const hisLast = document.getElementById("history-last");
            console.log("hisId", hisLast.id);
            hisLast.onclick = function(event){
                event.preventDefault();
                editHistory("last", i, method);
            }
        }else{
            let his = document.createElement('button');
            his.textContent = `${obj.content} : ${obj.amount}円`;
            his.id = "history-" + obj.content;
            his.className = "history";
            // historyGroup.innerHTML += `<button id="history-${obj.content}" class="history">${obj.content} : ${obj.amount}円</button><br>`;
            his.onclick = function(event){
                event.preventDefault();
                editHistory(obj.content, i, method);
            }
            historyGroup.appendChild(his);
            console.log("hisId", his.id);
        }
    }
}

function editHistory(content, index, method) {
    const his = document.getElementById("history-" + content);
    historyList.splice(index, 1);
    console.log(historyList);
    set_(historyRef, historyList);
    his.remove();
    // location.reload();
    // if (method == "tatekae"){
    //     window.location.href = `./tatekae/tatekae.html?id=${groupId}`;
    // }else if (method == "warikan"){
    //     window.location.href = `./warikan/warikan.html?id=${groupId}`;
    // }
}

// 高さの変更
function changeHeight() {
    const resText = document.getElementById("result-text");
    resText.style.height = resTextHeight + "px";
    const hisLast = document.getElementById("history-last");
    var offsetTop = hisLast.offsetTop;
    const texthis = document.getElementById("history-text");
    var offsetTop2 = texthis.offsetTop;
    console.log("text history height", offsetTop2);
    console.log("last history height", offsetTop);
    const hisHeight = offsetTop + offsetTop2 + 600;
    console.log("hisHeight", hisHeight);
    background.style.height = hisHeight + "px";
}

document.getElementById("copy-page").onclick = function() {
    $(document.body).append("<textarea id=\"copyTarget\" style=\"position:absolute; left:-9999px; top:0px;\" readonly=\"readonly\">" + location.href + "</textarea>");
    let obj = document.getElementById("copyTarget");
    let range = document.createRange();
    range.selectNode(obj);
    window.getSelection().addRange(range);
    navigator.clipboard.writeText(location.href); // location.hrefを渡す
    document.getElementById("cAction").innerHTML = "コピーしました";
};

// main //////////////////////////////////////////////////////
getGroupInfo()
    .then(getHistory)
    .then(initializeBalanceList)
    .then(calculateBalance)
    .then(mainCalculation)
    .then(showResult)
    .then(showMembers)
    .then(showHistory)
    .then(changeHeight)
    .catch(error => console.error(error));


