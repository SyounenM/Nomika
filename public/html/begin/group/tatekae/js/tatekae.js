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

let memberList = [];

// データベースへの参照
let groupRef = ref_(database,'groups/' + groupId);
let historyRef = ref_(database, 'groups/' + groupId + '/history');

let historyList = [];
let balanceList = [] ;
let resultList = [];
let selectedDebtors = [];

function addOption() {
    let creditorSelect = document.getElementById("creditor select");
    let debtorCheckboxWrapper = document.getElementById("debtor-checkbox-wrapper");
    debtorCheckboxWrapper.innerHTML = ''; // Clear existing checkboxes

    for (const member of memberList) {
        let creditorOption = document.createElement("option");
        let debtorCheckbox = document.createElement("input");
        let debtorLabel = document.createElement("label");

        creditorOption.text = member;
        creditorOption.value = member;
        creditorSelect.appendChild(creditorOption);

        debtorCheckbox.type = "checkbox";
        debtorCheckbox.className = "checkbox";
        debtorCheckbox.id = "debtor_" + member;
        debtorCheckbox.value = member;
        debtorLabel.htmlFor = "debtor_" + member;
        debtorLabel.textContent = member;
        
        debtorCheckbox.addEventListener("change", function() {
            // Handle checkbox change
            if (this.checked) {
                selectedDebtors.push(member);
            } else {
                const index = selectedDebtors.indexOf(member);
                if (index !== -1) {
                    selectedDebtors.splice(index, 1);
                }
            }
            console.log("Selected Debtors:", selectedDebtors);
        });

        debtorCheckboxWrapper.appendChild(debtorCheckbox);
        debtorCheckboxWrapper.appendChild(debtorLabel);
    }
}

// データベースから情報を取得
function getGroupInfo() {
    get_(groupRef)
        .then((snapshot) => {
        let data = snapshot.val();
        console.log(data);
        memberList = data["groupMember"];
        
        console.log("memberList:" + memberList);
        
    }).then(addOption)
        .catch((error) => {
            console.log("ID:" + groupId);
            console.error("データの読み取りに失敗しました", error);
    });
}

function checkFormInputs() {
    let checkboxes = document.querySelectorAll('input.checkbox'); // セレクタを更新
    let isChecked = false;

    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            isChecked = true;
            return; // チェックされたチェックボックスが見つかった場合、ループを終了します
        }
    });

    if (!isChecked) {
        alert('複数の人を選択してください'); // 一つもチェックボックスがチェックされていない場合にアラートを表示
        return false;
    }

    if (document.getElementById('creditor select').value == '' || document.getElementById('creditor select').value == null) {
        alert('支払いした人を入力してください');
        console.error('creditorNotFoundError');
        return false;
    }

    if (document.getElementById('amount').value == '' || document.getElementById('amount').value == null) {
        alert('支払い金額を入力してください');
        console.error('AmountNotFoundError');
        return false;
    } else if (document.getElementById('content').value == '' || document.getElementById('content').value == null) {
        alert('支払い内容を入力してください');
        console.error('ContentNotFoundError');
        return false;
    } else {
        return true;
    }
}

function calculateWarikan() {
    let creditor = document.getElementById("creditor select").value;
    let amount = document.getElementById("amount").value;
    let debtorsNumber = selectedDebtors.length;
    let creditorPayment = Math.floor(amount / debtorsNumber);
    let debtorPayment = Math.floor(amount / debtorsNumber);
    let remainder = amount - debtorPayment * debtorsNumber;
    let isIncludedCreditor = true;
    if (creditor in selectedDebtors) {
        isIncludedCreditor = true
    }
        else {
            isIncludedCreditor = false;
        }
    while (true) {
        if (remainder == 0) {
            break;
        }
        else {
            if (isIncludedCreditor) {
                if (remainder % (debtorsNumber-1) == 0) {
                    debtorPayment += remainder / (debtorsNumber-1);
                    remainder = 0;
                }
                else {
                    creditorPayment -= 1;
                    remainder += 1;
                }
            }
            else {
                if (remainder % debtorsNumber == 0) {
                    debtorPayment += remainder / debtorsNumber;
                    remainder = 0;
                }
                else {
                    creditorPayment -= 1;
                    remainder += 1;
                }
            }
        }
    }
    return debtorPayment;
}

function submitHistory() {
    return new Promise((resolve, reject) => {
        let debtorPayment = calculateWarikan();
        let creditor = document.getElementById("creditor select").value;
        // let amount = document.getElementById("amount").value;
        // let debtor = document.getElementById("debtor select").value;
        let content = document.getElementById("content").value;
        let data = [];
        data.push({
            "creditor": creditor,
            "amount": debtorPayment,
            "debtor": selectedDebtors,
            "content": content
        });
        for (let debtor of selectedDebtors) {
            if (debtor != creditor) {
                data.push({
                    "creditor": creditor,
                    "amount": debtorPayment,
                    "debtor": debtor,
                    "content": content
                });
            } else {
                continue;
            }
        }
        let newHistoryRef = push_(ref_(database, 'groups/' + groupId + '/history'));
        set_(newHistoryRef, data)
        .then(() => {
            console.log("履歴が正常に書き込まれました");
            resolve();
        })
        .catch((error) => {
            console.error("履歴の書き込みに失敗しました", error);
            reject(error);
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
                console.log(historyList);
                resolve();
            })
            .catch((error) => {
                console.error("データの読み取りに失敗しました", error);
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
    for( const { creditor, amount, debtor } of historyList ) {
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

function submitForm() {
    let isFormValid = checkFormInputs();
    if (isFormValid) {
        submitHistory()
            // .then(getHistory)
            // .then(initializeBalanceList)
            // .then(calculateBalance)
            // .then(mainCalculation)
            // .then(showResult)
            // .catch(error => console.error(error));
    }
}

// main /////////////////////////////////////////////////////////////////////////////////////////
getGroupInfo();
document.getElementById("transactionForm").addEventListener("submit", function(event) {
    event.preventDefault();
    submitForm();
});
