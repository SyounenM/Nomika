const memberList = ["秀島", "川崎", "佐々木", "福田", "松島"];
const memberDiv = document.getElementById('member');

function viewBuilder() {
    memberDiv.innerHTML = 'グループメンバー<br>' + memberList;
    let payerSelect = document.getElementById("payer");
    for (member of memberList) {
        let payerOption = document.createElement("option");
        payerOption.text = member;
        payerOption.value = member;
        payerSelect.appendChild(payerOption);
    }

    let resultTable = document.getElementById('result_table');
    for (member of memberList) {
        let tr = document.createElement("tr");

        // メンバー名
        let nameTd = document.createElement("td");
        let nameLabel = document.createElement("label");
        nameLabel.textContent = member;
        nameLabel.id = 'memberName' + member;
        nameTd.appendChild(nameLabel);
        tr.appendChild(nameTd);

        // 支払い金額
        let paymentTd = document.createElement('td');
        let paymentLabel = document.createElement('label');
        paymentLabel.id = 'payment' + member;
        paymentTd.appendChild(paymentLabel);
        tr.appendChild(paymentTd);

        // 傾斜
        let ratioTd = document.createElement('td');
        let ratioInput = document.createElement('input');
        ratioInput.type = 'number';
        ratioInput.id = 'memberRatio' + member;
        ratioInput.min = '0';
        ratioInput.max = '100';
        ratioInput.step = '1';
        ratioInput.valueAsNumber = 1;
        ratioTd.appendChild(ratioInput);
        tr.appendChild(ratioTd);

        resultTable.appendChild(tr);
    }
}

function calculate() {
    let memberCount = memberList.length;
    let totalAmount = parseFloat(document.getElementById('amount').value);

    // 各参加者ごとの支払い金額を計算
    let totalRatio = 0;
    for (member of memberList) {
        let ratio = parseFloat(document.getElementById('memberRatio' + member).value);
        totalRatio += ratio;
    }

    for (let i = 0; i < memberCount; i++) {
        let member = memberList[i];
        let ratio = parseFloat(document.getElementById('memberRatio' + member).value);
        let amountPerPerson = (totalAmount * ratio) / totalRatio;
        document.getElementById('payment' + member).textContent = "¥" + amountPerPerson.toFixed(2);
    }
}

// 初回に一度呼び出す
viewBuilder();
