const memberList = ["秀島", "川崎", "佐々木", "福田", "松島"];
const memberDiv = document.getElementById('member');

function viewBuilder() {
    memberDiv.innerHTML = 'グループメンバー<br>' + memberList;
    let payerSelect = document.getElementById("payer");
    for(member of memberList) {
        let payerOption = document.createElement("option");
        payerOption.text = member;
        payerOption.value = member;
        payerSelect.appendChild(payerOption);
    }

    let resultTable = document.getElementById('result_table');
    for (member of memberList) {
        //空の行要素を先に作成tr
        let tr = document.createElement("tr");

        // メンバー名
        let nameTd = document.createElement("td");      //新しいtd要素を作って変数tdに格納
        let nameLabel = document.createElement("label");  //tdに何か追加。
        nameLabel.type = 'text';
        nameLabel.textContent = member;
        nameLabel.id = 'memberName' + member;
        nameTd.appendChild(nameLabel);        //tdにinpを追加
        tr.appendChild(nameTd);         //trにtdを追加
        
        //支払い金額
        let paymentTd = document.createElement('td');
        let paymentLabel = document.createElement('label');
        paymentLabel.type = 'text';
        paymentLabel.id = 'payment' + member;
        paymentTd.appendChild(paymentLabel);
        tr.appendChild(paymentTd)

        // 傾斜
        let ratioTd = document.createElement('td');
        let ratioInput = document.createElement('input');        
        ratioInput.type = 'number';
        ratioInput.id = 'memberRatio' + member;
        ratioInput.min = '0';
        ratioInput.max = '100';
        ratioInput.step = '1';
        ratioInput.valueAsNumber = 1
        ratioTd.appendChild(ratioInput);
        tr.appendChild(ratioTd)

        //完成したtrをtableに追加
        resultTable.appendChild(tr);



    }
}

function calculate() {
    let memberCount = memberList.length;
    let totalAmount = parseFloat(document.getElementById('amount').value);
    // console.log(1);

    // 参加者の名前と割合を取得
    let membersRatio = [];
    for (member of memberList) {
        let name = document.getElementById('memberName' + member).textContent;
        let ratio = parseFloat(document.getElementById('memberRatio' + member).valueAsNumber);
        membersRatio.push({ name: name, ratio: ratio });
    }

    // 各参加者ごとの支払い金額を計算
    let totalRatio = membersRatio.reduce((sum, member) => sum + member.ratio, 0);

    for (let i = 0; i < memberCount; i++) {
        let amountPerPerson = (totalAmount * membersRatio[i].ratio) / totalRatio;
        let resultText = "¥" + amountPerPerson.toFixed(2);
        // console.log(resultText)
        // console.log(document.getElementById('payment' + memberList[i]).type)
        document.getElementById('payment' + memberList[i]).textContent = resultText;
    }
    // viewBuilder();

}

// // 参加者の数が変更されたときに入力フィールドを更新
// document.getElementById('submit').addEventListener('click', viewBuilder);

// 初回にも一度呼び出す
viewBuilder();