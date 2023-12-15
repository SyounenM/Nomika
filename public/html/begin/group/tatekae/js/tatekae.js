import { app, database, ref_, set_, get_, update_, push_, goOffline_}  from "../../../../../js/master.js";
// import { serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
// アプリケーションが閉じられたときに呼ばれる処理
window.onbeforeunload = function () {
    // Firebase Realtime Databaseへの接続を切断
    goOffline_(database);
};

const groupId = new URLSearchParams(window.location.search).get('id');
const logo = document.getElementById("logo");
const top = document.getElementById("top");
const home = document.getElementById("home");
const back = document.getElementById("back");
logo.href = `../group.html?id=${groupId}`;
function showAlert() {
    var result = confirm('注意 グループから抜けることになります');
    if (result){
        top.href = `../../../../index.html`;
    }
}
top.onclick = showAlert;
home.href = `../group.html?id=${groupId}`;
back.href = `../group.html?id=${groupId}`;

let groupName = "";
let memberList = [];
let preResult = {};
// let resultDict = {};// 今回の割り勘結果を格納するjson
// let pushResult = {};
// データベースへの参照
let groupRef = ref_(database,'groups/' + groupId);
let historyRef = ref_(database, 'groups/' + groupId + '/history');
// let resultRef = ref_(database, 'groups/' + groupId);

// データベースから情報を取得
get_(groupRef)
    .then((snapshot) => {
    let data = snapshot.val();
    console.log(data);
    groupName = data["groupName"];
    console.log("groupname:" + groupName);
    preResult = data["info"];

    memberList = Object.keys(preResult);
    
    console.log("memberList:" + memberList);
    //グループ名表示
    // groupDiv.innerHTML = 'グループ名：' + groupName + "</br>";

    // 画面生成
    addOption();
})
    .catch((error) => {
        console.log("ID:" + groupId);
        console.error("データの読み取りに失敗しました", error);
});

// const memberList = ["秀島", "川崎", "佐々木", "福田", "松島"];

let historyList = [];

let balanceList = [] ;

let resultList = [];

function addOption() {
    let creditorSelect = document.getElementById("creditor select");
    let debtorSelect = document.getElementById("debtor select");
    for(const member of memberList) {
        let creditorOption = document.createElement("option");
        let debtorOption = document.createElement("option");
        creditorOption.text = member;
        creditorOption.value = member;
        debtorOption.text = member;
        debtorOption.value = member;
        creditorSelect.appendChild(creditorOption);
        debtorSelect.appendChild(debtorOption);
    }
}

function initializeBalanceList() {
    for ( const member of memberList ) {
        balanceList.push({"name": member, "balance": 0});
        console.log("balanceList確認");
        console.log(balanceList);
    }
}
function checkFormInputs() {
    if (document.getElementById('creditor select').value == '' || document.getElementById('creditor select').value == null) {
        alert('支払いした人を入力してください');
        console.error('creditorNotFoundError');
        return false;
    }
    if (document.getElementById('amount').value == '' || document.getElementById('amount').value == null) {
        alert('支払い金額を入力してください');
        console.error('AmountNotFoundError');
        return false;
    }
    else if (document.getElementById('debtor select').value == '' || document.getElementById('debtor select').value == null) {
        alert('支払いしてもらった人を入力してください');
        console.error('DebtorNotFoundError');
        return false;
    }
    else if (document.getElementById('content').value == '' || document.getElementById('content').value == null) {
        alert('支払い内容を入力してください');
        console.error('ContentNotFoundError');
        return false;
    }
    else {
        return true;
    }
}

function submitHistory() {
    return new Promise((resolve, reject) => {
        const newHistoryRef = push_(ref_(database, 'groups/' + groupId + '/history'));
        let creditor = document.getElementById("creditor select").value;
        let amount = document.getElementById("amount").value;
        let debtor = document.getElementById("debtor select").value;
        let content = document.getElementById("content").value;
        let data = {
            "creditor": creditor,
            "amount": amount,
            "debtor": debtor,
            "content": content
        };

        set_(newHistoryRef, {
            "data": data
        })
        .then(() => {
            console.log("データが正常に書き込まれました");
            resolve();
        })
        .catch((error) => {
            console.error("データの書き込みに失敗しました", error);
            reject(error);
        });
    });
}

function getHistory() {
    return new Promise((resolve, reject) => {
        get_(historyRef)
            .then((snapshot) => {
                let history = snapshot.val();
                let historyData = Object.values(history);
                historyList = historyData.map(item => item.data);
                console.log(historyList);
                resolve();
            })
            .catch((error) => {
                console.error("データの読み取りに失敗しました", error);
                reject(error);
            });
    });
}

// function submitHistory() {
//     const newHistoryRef = push_(ref_(database, 'groups/' + groupId + '/history'));
//     let creditor = document.getElementById("creditor select").value;
//     let amount = document.getElementById("amount").value;
//     let debtor = document.getElementById("debtor select").value;
//     let content = document.getElementById("content").value;
//     let data = {
//         "creditor": creditor,
//         "amount": amount,
//         "debtor": debtor,
//         "content": content
//     };
//     set_(newHistoryRef, {
//         // "timestamp": serverTimestamp(),
//         "data":data
//     })
//     .then(()=>{
//         console.log("データが正常に書き込まれました");
//     })
//     .catch((error)=>{
//         console.error("データの書き込みに失敗しました", error);
//     })
// }
// function getHistory() {
//     get_(historyRef)
//         .then((snapshot) => {
//         let history = snapshot.val();
//         let historyData = Object.values(history);
//         historyList = historyData.map(item => item.data);
//         console.log(historyList);
//     })
//         .catch((error) => {
//             console.error("データの読み取りに失敗しました", error);
//     });
// }

function calculateBalance() {
    console.log("historyList確認");
    console.log(historyList);
    for( const { creditor, amount, debtor } of historyList ) {
        let creditorObject = balanceList.find(memberObj => memberObj.name === creditor);
        let debtorObject = balanceList.find(memberObj => memberObj.name === debtor);
        console.log("calculateBalance確認");
        console.log(creditorObject);
        console.log(debtorObject);
        if (creditorObject) {
            creditorObject.balance += parseInt(amount);
        }
        if (debtorObject) {
            debtorObject.balance -= parseInt(amount)
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
    res.innerHTML = ""; // 以前の結果をクリア
    for (const obj of resultList) {
        // 各結果を表示
        res.innerHTML += `${obj.debtor}が${obj.creditor}に${obj.amount}円支払い<br>`;
    }
}

function submitResult() {
    return new Promise((resolve, reject) => {
        const resultRef = ref_(database, 'groups/' + groupId + '/result');

        set_(resultRef, {
            "data": resultList
        })
        .then(() => {
            console.log("データが正常に書き込まれました");
            resolve();
        })
        .catch((error) => {
            console.error("データの書き込みに失敗しました", error);
            reject(error);
        });
    });
}

function submitForm() {
    let isFormValid = checkFormInputs();
    if (isFormValid) {
        submitHistory()
            .then(getHistory)
            .then(initializeBalanceList)
            .then(calculateBalance)
            .then(mainCalculation)
            .then(showResult)
            .then(submitResult)
            .catch(error => console.error(error));
    }
}

document.getElementById("transactionForm").addEventListener("submit", function(event) {
    event.preventDefault();
    submitForm();
});

// // addOption();
// document.getElementById("transactionForm").addEventListener("submit", function(event) {
//     event.preventDefault();
//     let isFormValid = checkFormInputs();
//     if (isFormValid) {
//         submitHistory();
//         getHistory();
//         initializeBalanceList();
//         calculateBalance();
//         main();
//         showResult();
//     }
// });
