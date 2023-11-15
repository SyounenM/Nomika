const memberList = ["秀島", "川崎", "佐々木", "福田", "松島"];

let historyList = [];

let balanceList = [] ;

let resultList = [];

function addOption() {
    let payerSelect = document.getElementById("payer");
    let debtorSelect = document.getElementById("debtor");
    for(const member of memberList) {
        let payerOption = document.createElement("option");
        let debtorOption = document.createElement("option");
        payerOption.text = member;
        payerOption.value = member;
        debtorOption.text = member;
        debtorOption.value = member;
        payerSelect.appendChild(payerOption);
        debtorSelect.appendChild(debtorOption);
    }
}
function initializeBalanceList() {
    for ( const member of memberList ) {
        balanceList.push({"member_name": member, "price_to_get": 0});
    }
}
function checkFormInputs() {
    if (document.getElementById('payer').value == '' || document.getElementById('payer').value == null) {
        alert('支払いした人を入力してください');
        console.error('PayerNotFoundError');
        return false;
    }
    if (document.getElementById('amount').value == '' || document.getElementById('amount').value == null) {
        alert('支払い金額を入力してください');
        console.error('AmountNotFoundError');
        return false;
    }
    else if (document.getElementById('debtor').value == '' || document.getElementById('debtor').value == null) {
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
    let payer = document.getElementById("payer").value;
    let amount = document.getElementById("amount").value;
    let involves = [document.getElementById("debtor").value];
    let content = document.getElementById("content").value;
    let data = {
        "payer": payer,
        "amount": amount,
        "involves": involves,
        "content": content
    };
    historyList.push(data);
}

function calculateBalance() {
    for( const { payer, amount, involves } of historyList ) {
        payerObject = balanceList.find(memberObj => memberObj.member_name === payer);
        debtorObject = balanceList.find(memberObj => memberObj.member_name === involves[0]);
        if (payerObject) {
            payerObject.price_to_get += parseInt(amount);
        }
        if (debtorObject) {
            debtorObject.price_to_get -= parseInt(amount)
        }
    }
}

function calculation(payment, liquidation = []) {
    // Sort in descending order based on price_to_get
    payment.sort((a, b) => b.price_to_get - a.price_to_get);

    // Get the current max creditor and max debtor
    let creditor = payment[0];
    let debtor = payment[payment.length - 1];

    // Calculate the liquidation amount
    let amount = Math.min(creditor.price_to_get, Math.abs(debtor.price_to_get));

    // If the liquidation amount is 0, exit
    if (amount === 0) {
        return { payment, liquidation };
    }

    // Perform the liquidation between creditor and debtor, and make a recursive call
    creditor.price_to_get -= amount;
    debtor.price_to_get += amount;

    liquidation.push({
        debtor: debtor.member_name,
        creditor: creditor.member_name,
        amount: amount
    });
    return calculation(payment, liquidation);
}

function main() {
    // Get the total_balance (sample data)
    let total_balance = balanceList;

    // Display the initial balances
    console.log(total_balance)
    console.log('Initial Balances:');
    total_balance.forEach(payment => {
        console.log(`${payment.member_name}: ${payment.price_to_get}`);
    });

    // Perform the liquidation
    let result = calculation(total_balance);

    // Display the liquidation amounts
    console.log('-----------------');
    console.log('Liquidation Amounts:');
    result.liquidation.forEach(l => {
        console.log(`${l.debtor} -> ${l.creditor}: ${parseInt(l.amount)}`);
    });

    // Display the remaining balances after liquidation
    console.log('-----------------');
    console.log('Remaining Balances:');
    result.payment.forEach(p => {
        console.log(`${p.member_name}: ${parseInt(p.price_to_get)}`);
    });

    // Display the offset amount
    console.log('-----------------');
    let total = result.payment.reduce((acc, p) => acc + p.price_to_get, 0);
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
