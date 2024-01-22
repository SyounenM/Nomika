import {database, ref_, set_, get_, update_, push_, goOffline_}  from "../../../../js/master.js";
const groupH3 = document.getElementById("groupH3");
const tatekaeButton = document.getElementById("tatekaeButton");
const warikanButton = document.getElementById("warikanButton");
const gameButton = document.getElementById("gameButton");
const editButton = document.getElementById("editButton");
const icon = document.getElementById("icon");
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
        window.location.href = `../../../500.html`;
});


tatekaeButton.href = `./tatekae/tatekae.html?id=${groupId}`;
warikanButton.href = `./warikan/warikan.html?id=${groupId}`;
gameButton.href = `./game/game.html?id=${groupId}`;
editButton.href = `./edit/edit.html?id=${groupId}`;
icon.href = `./group.html?id=${groupId}`;
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
console.log(historyRef);

let historyList = [];
let historyIdList = [];
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
                window.location.href = `../../../500.html`;
            });
    });
}


function getHistory() {
    return new Promise((resolve, reject) => {
        get_(historyRef)
            .then((snapshot) => {
                let history = snapshot.val();
                console.log(history);
                historyList = Object.values(history);
                historyIdList = Object.keys(history)
                console.log(historyIdList);
                // historyList = historyData.map(item => item.data);
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
    res.innerHTML += "<h3 class=result-text>精算結果</h3>"
    for (const obj of resultList) {
        // 各結果を表示
        res.innerHTML += `<div class="result">${obj.debtor} → ${obj.creditor} : ${obj.amount}円</div>`;
        dispHeight += 18;
    }
    dispScope.style.height = dispHeight + "px";
}

function showMembers() {
    for (let member of memberList) {
        let memberDiv = document.getElementById('member');
        let memberSpan = document.createElement('span');
        memberSpan.textContent = member;
        memberSpan.id = member + 'Span';
        memberSpan.style = 'font-size: 25px; background-color: white; margin-right:10px; border: solid 1px black; border-width: 2px; border-radius: 10px; padding-left: 8px; padding-right: 8px; padding-top: 4px; padding-bottom: 4px;';
        // memberSpan.style.border = 'solid'
        memberDiv.appendChild(memberSpan);
        dispHeight += 42; //表示部分高さの変更
    }
    let lastMember = document.getElementById(memberList[memberList.length - 1] + 'Span');
    console.log("lastMemberHeight", lastMember.offsetTop);
    resTextHeight = lastMember.offsetTop + 60;
}

function showHistory() {
    var historyGroup = document.getElementById("history-group");
    console.log(historyList);
    for (var i = 0; i < historyList.length; i++) {
        console.log("historyList[", i, "]", historyList[i][0]);
        const obj = historyList[i][0]
        // 各結果を表示
        let his = document.createElement("button");
        his.className = "history";
        his.textContent = obj.content + " : " + obj.amount + "円";
        console.log("historyList[", i, "]", historyList[i][0]);
        let method = obj.method
        console.log("his", his.id);
        let index = i;
        console.log(method);
        his.onclick = function(event){
            event.preventDefault();
            console.log(index);
            editHistory(obj.content, index, method, historyIdList[index]);
        }
        historyGroup.appendChild(his);
        historyGroup.appendChild(document.createElement("br"));
    }
}

function editHistory(content, index, method, historyId) {
    console.log("content", content);
    if (method == "tatekae"){
        window.location.href = `./tatekae/tatekae.html?id=${groupId}&historyId=${historyId}`;
    } 
    if (method == "warikan"){
        window.location.href = `./warikan/warikan.html?id=${groupId}&historyId=${historyId}`;
    }
}

// 高さの変更
function changeHeight() {
    let bottom = document.getElementById("bottom");
    var offsetTop = bottom.offsetTop;
    background.style.height = offsetTop + 800 + "px";
}

function changeFooter(){
    const footer = document.getElementById("footer");
    console.log("footer", footer.offsetWidth);
    var viewportWidth = window.innerWidth;
    footer.style.width = viewportWidth + 10 + "px";
    console.log("footer", footer.offsetWidth);
}

const toggleButton = document.getElementById('toggleButton');
toggleButton.addEventListener('click', function() {
    var content = document.getElementById('toggleContent');
    if (content.style.display === 'none') {
        content.style.display = 'block';
        toggleButton.textContent = "閉じる";
    } else {
        content.style.display = 'none';
        toggleButton.textContent = "共有";
    }
    changeHeight();
});

const toggleButton2 = document.getElementById('toggleButton2');
toggleButton2.addEventListener('click', function() {
    var content = document.getElementById('toggleContent2');
    if (content.style.display === 'none') {
        content.style.display = 'block';
        toggleButton2.textContent = "閉じる";
    } else {
        content.style.display = 'none';
        toggleButton2.textContent = "メンバー";
    }
    changeHeight();
});

// リンクコピー機能
document.getElementById("copy-page").onclick = function() {
    const copyText = document.createElement("textarea");
    copyText.value = location.href;
    copyText.setAttribute('readonly', '');
    copyText.style.position = 'absolute';
    copyText.style.left = '-9999px';
    document.body.appendChild(copyText);
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand('copy');
    document.body.removeChild(copyText);
    document.getElementById("cAction").innerHTML = "コピーしました";
};

// https://qiita.com/tarusawa_ken/items/9d9a8b7b6ca8b6984eb9
// launchApp関数を定義
function launchApp() {
    var IOS_SCHEME = 'paypay://';
    var IOS_STORE = 'https://apps.apple.com/jp/app/paypay-ペイペイ/id1435783608';
    var ANDROID_SCHEME = 'paypay://';
    var ANDROID_PACKAGE = 'jp.ne.paypay.android.app';
    var PC_SITE = 'https://paypay.ne.jp'

    var userAgent = navigator.userAgent.toLowerCase();
    
    // iPhone端末ならアプリを開くかApp Storeを開く。
    if (userAgent.search(/iphone|ipad|ipod/) > -1) {
        window.location.href = IOS_SCHEME;
        // app storeに飛ばす例外処理をちゃんと考える
        // setTimeout(function() {
        //     window.location.href = IOS_STORE;
        // }, 500);  
    }
    // Android端末ならアプリを開くかGoogle Playを開く。
    // 実験してないので動くかわからない
    else if (userAgent.search(/android/) > -1) {
        window.location.href = 'intent://#Intent;scheme=' + ANDROID_SCHEME
                + ';package=' + ANDROID_PACKAGE + ';end';
    }
    // その他・不明・PCなどの場合はサイトを開く。
    else {
        window.location.href = PC_SITE;
    }
}
// ボタンをクリックしたときにlaunchApp関数を実行してPayPayを起動
document.getElementById("PayPay").onclick = function() {
    launchApp();
};

// LINE共有機能
document.getElementById('LINE').addEventListener('click', function() {
    const currentURL = encodeURIComponent(window.location.href);
    const sharedText = ''; // 共有するテキスト

    const lineShareURL = `http://line.me/R/share?text=${sharedText} ${currentURL}`;
    window.open(lineShareURL, '_blank');
});


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

// main //////////////////////////////////////////////////////
getGroupInfo()
    .then(changeFooter)
    .then(showMembers)
    .then(changeHeight)
    .then(getHistory)
    .then(initializeBalanceList)
    .then(calculateBalance)
    .then(mainCalculation)
    .then(showResult)
    .then(showHistory)
    .then(changeHeight)
    .catch(error => console.error(error));