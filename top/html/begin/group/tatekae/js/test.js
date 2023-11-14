var memberList = ["秀島", "川崎", "佐々木", "福田", "松島"];

var history = [];

var result = [];

function addOption() {
    let payerSelect = document.getElementById("payer");
    let debtorSelect = document.getElementById("debtor");
    for(member of memberList) {
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

function addHistory() {
    let payer = document.getElementById("payer");
    let amount = document.getElementById("amount");
    let involves = [document.getElementById("debtor")];
    let content = document.getElementById("content");
    let data = {
        "payer": payer,
        "amount": amount,
        "involves": involves,
        "content": content
    }
    history.push(data);
}

function calculate() {
    const init = { balance: 0, consumption: 0 };
    Map.prototype.fetch = function (id) {
    return (
        this.get(id) || this.set(id, Object.assign({ name: id }, init)).get(id)
    );
    };

    const data = new Map();

    for (const { payer, amount, involves } of history) {
    const record = data.fetch(payer);
    record.balance += amount;
    const debt = Math.ceil(amount / involves.length);
    // actual payer should not owe extra debt coming from rounded up numbers
    const payerDebt = amount - debt * (involves.length - 1);
    for (const debtor of involves.map((i) => data.fetch(i))) {
        const cost = Math.round(amount / involves.length);
        debtor.balance -= cost;
        debtor.consumption += cost;
    }
    }

    console.log(data);

    // calculate transaction table
    const transaction = [];
    let paidTooMuch, paidLess;
    while (true) {
    for (const [_, tbl] of data) {
        if (tbl.balance >= (paidTooMuch?.balance || 0)) {
        paidTooMuch = tbl;
        }
        if (tbl.balance <= (paidLess?.balance || 0)) {
        paidLess = tbl;
        }
    }

    if (paidLess.balance == 0 || paidTooMuch.balance == 0) break;

    const amount = Math.min(paidTooMuch.balance, Math.abs(paidLess.balance));

    transaction.push({
        sender: paidLess.name,
        receiver: paidTooMuch.name,
        amount,
    });

    paidTooMuch.balance -= amount;
    paidLess.balance += amount;
    }

    console.log("Settled");

    console.log("\n# Transaction table");
    for (const ev of transaction) {
    console.log(`${ev.sender} owes ${ev.receiver} ¥${ev.amount}`);
    }

    console.log("\n# History");
    for (const { payer, amount, involves } of history) {
    if (involves.length === 1) {
        console.log(`${payer} lent ¥${amount} to ${involves[0]}`);
    } else {
        console.log(`${payer} paid ¥${amount} for ${involves.join(", ")}`);
    }
    }

    console.log("\n# Expenses");
    for (const [_, { name, consumption }] of data) {
    console.log(`${name} virtually paid ¥${consumption} in total`);
    }
    let res = {
        "sender": ev.sender,
        "receiver": ev.receiver,
        "amount": ev.amount
    }
    result.push(res)
}

function showResult() {
    var res = document.getElementById("result")
    res.textContent = "${res}"
}

addOption();
console.log(history);
let transactionForm = document.getElementById("transactionForm");
transactionForm.addEventListener("submit", () => {
    console.log(2);
    addHistory();
    console.log(history);
    calculate();
    alert(res);
    showResult();
});
