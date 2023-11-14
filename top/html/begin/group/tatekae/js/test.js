const memberList = ["秀島", "川崎", "佐々木", "福田", "松島"];

let historyList = [];

let resultList = [];

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
    console.log(history);
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
    console.log(historyList);
}
function calculate(history, result) {
    // calculate balance sheet
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
    console.log(paidLess.balance);
    if (paidLess.balance == 0 || paidTooMuch.balance == 0) break;

    const amount = Math.min(paidTooMuch.balance, Math.abs(paidLess.balance));
    console.log("amount");
    console.log(amount);
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
    result = transaction;
    return history, result;
}
// function calculate() {
//     const init = { balance: 0, consumption: 0 };
//     Map.prototype.fetch = function (id) {
//     return (
//         this.get(id) || this.set(id, Object.assign({ name: id }, init)).get(id)
//     );
//     };

//     const data = new Map();

//     for (const { payer, amount, involves, content } of hist) {
//     const record = data.fetch(payer);
//     record.balance += amount;
//     const debt = Math.ceil(amount / involves.length);
//     // actual payer should not owe extra debt coming from rounded up numbers
//     const payerDebt = amount - debt * (involves.length - 1);
//     for (const debtor of involves.map((i) => data.fetch(i))) {
//         const cost = Math.round(amount / involves.length);
//         debtor.balance -= cost;
//         debtor.consumption += cost;
//     }
//     }

//     console.log(data);

//     // calculate transaction table
//     const transaction = [];
//     let paidTooMuch, paidLess;
//     while (true) {
//     for (const [_, tbl] of data) {
//         if (tbl.balance >= (paidTooMuch?.balance || 0)) {
//         paidTooMuch = tbl;
//         }
//         if (tbl.balance <= (paidLess?.balance || 0)) {
//         paidLess = tbl;
//         }
//     }

//     if (paidLess.balance == 0 || paidTooMuch.balance == 0) break;

//     const amount = Math.min(paidTooMuch.balance, Math.abs(paidLess.balance));

//     transaction.push({
//         sender: paidLess.name,
//         receiver: paidTooMuch.name,
//         amount,
//     });

//     paidTooMuch.balance -= amount;
//     paidLess.balance += amount;
//     }

//     console.log("Settled");
//     console.log("\n# Transaction table");
//     for (const ev of transaction) {
//     console.log(`${ev.sender} owes ${ev.receiver} ¥${ev.amount}`);
//     }

//     console.log("\n# History");
//     for (const { payer, amount, involves } of hist) {
//     if (involves.length === 1) {
//         console.log(`${payer} lent ¥${amount} to ${involves[0]}`);
//     } else {
//         console.log(`${payer} paid ¥${amount} for ${involves.join(", ")}`);
//     }
//     }

//     console.log("\n# Expenses");
//     for (const [_, { name, consumption }] of data) {
//     console.log(`${name} virtually paid ¥${consumption} in total`);
//     }
//     result = transaction
// }

function showResult() {
    var res = document.getElementById("result");
    res.innerHTML = ""; // 以前の結果をクリア
    for (const obj of resultList) {
        // 各結果を表示
        res.innerHTML += `${obj.sender}が${obj.receiver}に${obj.amount}円支払い<br>`;
    }
}

addOption();
document.getElementById("transactionForm").addEventListener("submit", function(event) {
    event.preventDefault();
    addHistory();
    historyList, resultList = calculate(historyList, resultList);
    showResult();
  });
