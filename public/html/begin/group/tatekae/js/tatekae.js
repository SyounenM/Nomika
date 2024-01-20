import {database, ref_, set_, get_, update_, push_, goOffline_, remove_}  from "../../../../../js/master.js";
// import { serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
// アプリケーションが閉じられたときに呼ばれる処理
window.onbeforeunload = function () {
    // Firebase Realtime Databaseへの接続を切断
    goOffline_(database);
};

const groupId = new URLSearchParams(window.location.search).get('id');
const icon = document.getElementById("icon");
const logo = document.getElementById("logo");
const top = document.getElementById("top");
const home = document.getElementById("home");
const back = document.getElementById("back");
const remove = document.getElementById("remove");
remove.style.display = "none";
icon.href = `../group.html?id=${groupId}`;
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
const historyId = new URLSearchParams(window.location.search).get('historyId');

let historyList = [];
let balanceList = [] ;
let resultList = [];
let selectedDebtors = [];
let isEdit = false;
let totalAmount = 0;
let content = "";
let creditor = "";
let debtor = [];

function addOption() {
    let creditorSelect = document.getElementById("creditor select");
    let debtorCheckboxWrapper = document.getElementById("debtor-checkbox-wrapper");
    debtorCheckboxWrapper.innerHTML = ''; // Clear existing checkboxes

    for (const member of memberList) {
        let creditorOption = document.createElement("option");
        let debtorCheckbox = document.createElement("input");
        let debtorLabel = document.createElement("label");
        let newPara = document.createElement("p");

        creditorOption.text = member;
        creditorOption.value = member;
        creditorSelect.appendChild(creditorOption);

        debtorCheckbox.type = "checkbox";
        debtorCheckbox.className = "checkbox-tatekae";
        debtorCheckbox.id = "debtor_" + member;
        debtorCheckbox.value = member;
        debtorLabel.htmlFor = "debtor_" + member;
        debtorLabel.textContent = member;
        debtorLabel.className = "checkbox-label";
        
        debtorCheckbox.addEventListener("change", function() {
            // Handle checkbox change
            if (this.checked) {
                if (!selectedDebtors.includes(member)){
                    selectedDebtors.push(member);
                }
            } else {
                if (allDebtorCheckbox.checked) {
                    allDebtorCheckbox.checked = false;
                    for (const member_ of memberList) {
                        if (member_ != member){
                            let checkbox = document.getElementById("debtor_" + member_);
                            checkbox.checked = true;
                        }
                    }
                }
                const index = selectedDebtors.indexOf(member);
                if (index !== -1) {
                    selectedDebtors.splice(index, 1);
                }
            }
            console.log("Selected Debtors:", selectedDebtors);
        });

        newPara.className = "new-para"

        newPara.appendChild(debtorCheckbox);
        newPara.appendChild(debtorLabel);
        debtorCheckboxWrapper.appendChild(newPara);
        var rect = back.getBoundingClientRect();
        debtorCheckbox.style.left = rect.left/1.4 + "px";
        debtorLabel.style.left = rect.left/1.4+ 20 + "px";
    }

    let allCreditorOption = document.createElement("option");
    let allDebtorCheckbox = document.createElement("input");
    let allDebtorLabel = document.createElement("label");
    let allNewPara = document.createElement("p");

    allCreditorOption.text = "全員";
    allCreditorOption.value = "全員";
    creditorSelect.appendChild(allCreditorOption);

    allDebtorCheckbox.type = "checkbox";
    allDebtorCheckbox.className = "checkbox-tatekae";
    allDebtorCheckbox.id = "debtor_all";
    allDebtorCheckbox.value = "全員";
    allDebtorLabel.htmlFor = "debtor_all";
    allDebtorLabel.textContent = "全員";
    allDebtorLabel.className = "checkbox-label";
    
    allDebtorCheckbox.addEventListener("change", function() {
        // Handle checkbox change
        if (this.checked) {
            for (const member of memberList) {
                if (!selectedDebtors.includes(member)){
                    selectedDebtors.push(member);
                }
                let checkbox = document.getElementById("debtor_" + member);
                checkbox.checked = true;
            }
        } else {
            for (const member of memberList) {
                const index = selectedDebtors.indexOf(member);
                if (index !== -1) {
                    selectedDebtors.splice(index, 1);
                }
                let checkbox = document.getElementById("debtor_" + member);
                checkbox.checked = false;
            }
        }
        console.log("Selected Debtors:", selectedDebtors);
    });

    if (isEdit) {
        allDebtorCheckbox.checked = debtor.length === memberList.length;
        if (allDebtorCheckbox.checked) {
            for (const member of memberList) {
                if (!selectedDebtors.includes(member)){
                    selectedDebtors.push(member);
                }
                let checkbox = document.getElementById("debtor_" + member);
                checkbox.checked = true;
            }
        } else {
            for (const member of memberList) {
                let checkbox = document.getElementById("debtor_" + member);
                checkbox.checked = debtor.includes(member);
                if (checkbox.checked) {
                    if (!selectedDebtors.includes(member)){
                        selectedDebtors.push(member);
                    }
                    let checkbox = document.getElementById("debtor_" + member);
                    checkbox.checked = true;
                } 
            }
        }
        creditorSelect.value = creditor;
        let amount = document.getElementById("amount");
        let contentElement = document.getElementById("content");
        amount.value = totalAmount;
        contentElement.value = content;
        const newHistoryRef = ref_(database,'groups/' + groupId + '/history/' + historyId);
        remove.style.display = "";
        remove.onclick = function() {
            var confirmation = confirm("この履歴を削除しますか？");
            if (confirmation) {
                remove_(newHistoryRef);
                window.location.href = `../group.html?id=${groupId}`;
            }
        }
    }

    allNewPara.className = "new-para"

    allNewPara.appendChild(allDebtorCheckbox);
    allNewPara.appendChild(allDebtorLabel);
    debtorCheckboxWrapper.insertBefore(allNewPara, debtorCheckboxWrapper.firstChild);
    var rect = back.getBoundingClientRect();
    allDebtorCheckbox.style.left = rect.left/1.4 + "px";
    allDebtorLabel.style.left = rect.left/1.4+ 20 + "px";

    changeHeight();
    changeFooter();
}

// データベースから情報を取得
function getGroupInfo() {
    get_(groupRef)
        .then((snapshot) => {
        let data = snapshot.val();
        console.log(data);
        memberList = data["groupMember"];
        console.log("memberList:" + memberList);

        if (historyId != null){
            isEdit = true;
            let groupInfo = data["history"][historyId][0];
            totalAmount = groupInfo["amount"];
            content = groupInfo["content"] ?? "";
            creditor = groupInfo["creditor"] ?? "";
            debtor = groupInfo["debtor"] ?? [];
        }
        
    }).then(addOption)
        .catch((error) => {
            console.log("ID:" + groupId);
            console.error("データの読み取りに失敗しました", error);
    });
}

function checkFormInputs() {
    let checkboxes = document.querySelectorAll('input.checkbox-tatekae'); // セレクタを更新
    let isChecked = false;

    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            isChecked = true;
            return; // チェックされたチェックボックスが見つかった場合、ループを終了します
        }
    });

    if (!isChecked) {
        alert('誰に払ったかをを選択してください'); // 一つもチェックボックスがチェックされていない場合にアラートを表示
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
    let flgConfirm = true;
    return new Promise((resolve, reject) => {
        let debtorPayment = calculateWarikan();
        let creditor = document.getElementById("creditor select").value;
        let amount = document.getElementById("amount").value;
        // let debtor = document.getElementById("debtor select").value;
        let content = document.getElementById("content").value;
        let data = [];
        data.push({
            "method": "tatekae",
            "creditor": creditor,
            "amount": amount,
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
        let newHistoryRef;
        if (historyId == null){
            newHistoryRef = push_(ref_(database, 'groups/' + groupId +'/history'));
            console.log(newHistoryRef.key);
        }else {
            newHistoryRef = ref_(database,'groups/' + groupId + '/history/' + historyId);
        }
        set_(newHistoryRef, data)
        .then(() => {
            console.log("履歴が正常に書き込まれました");
            resolve();
        })
        .catch((error) => {
            console.error("履歴の書き込みに失敗しました", error);
            reject(error);
        });
        if (flgConfirm){
            var confirmation = confirm("保存されました。ホーム画面に戻りますか？");
            if (confirmation) {
                window.location.href = `../group.html?id=${groupId}`;
            }else{
                location.reload();
            }
        }
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

// 高さの変更
function changeHeight() {
    const background = document.getElementById("background-tatekae");
    var offsetTop = back.offsetTop;
    console.log("back height", offsetTop);
    const hisHeight = offsetTop + 600;
    console.log("hisHeight", hisHeight);
    background.style.height = hisHeight + "px";
}
function changeFooter(){
    const footer = document.getElementById("footer");
    console.log("footer", footer.offsetWidth);
    var viewportWidth = window.innerWidth;
    footer.style.width = viewportWidth + 10 + "px";
    console.log("footer", footer.offsetWidth);
}

// main /////////////////////////////////////////////////////////////////////////////////////////
getGroupInfo();
document.getElementById("transactionForm").addEventListener("submit", function(event) {
    event.preventDefault();
    submitForm();
});
