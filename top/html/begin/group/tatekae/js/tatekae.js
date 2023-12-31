const memberList = ["秀島", "川崎", "佐々木", "福田", "松島"];

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
function addHistory() {
    let creditor = document.getElementById("creditor select").value;
    let amount = document.getElementById("amount").value;
    let involves = [document.getElementById("debtor select").value];
    let content = document.getElementById("content").value;
    let data = {
        "creditor": creditor,
        "amount": amount,
        "involves": involves,
        "content": content
    };
    historyList.push(data);
}

function calculateBalance() {
    for( const { creditor, amount, involves } of historyList ) {
        creditorObject = balanceList.find(memberObj => memberObj.name === creditor);
        debtorObject = balanceList.find(memberObj => memberObj.name === involves[0]);
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

function main() {
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

addOption();
initializeBalanceList();
document.getElementById("transactionForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let isFormValid = checkFormInputs();
    if (isFormValid) {
        addHistory();
        calculateBalance();
        main();
        showResult();
    }
});
