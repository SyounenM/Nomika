let groupName = "ランチ"
let memberList = ["秀島", "川崎", "佐々木", "福田", "松島"];
let memberDiv = document.getElementById('member');
let groupDiv = document.getElementById('group');

function viewBuilder() {
    //グループ名表示
    groupDiv.innerHTML = 'グループ名：' + groupName + "</br>";
    //メンバー表示
    for (let member of memberList) {
        let memberSpan = document.createElement('span');
        memberSpan.textContent = member;
        memberSpan.id = member + 'Span';
        memberSpan.style = 'background-color:#BBBB; margin-right:10px; border: solid 1px #BBB; border-width: 2px; border-radius: 10px;';
        // memberSpan.style.border = 'solid'
        memberDiv.appendChild(memberSpan);
    }
    //支払い人
    let payerSelect = document.getElementById("payer");
    for(member of memberList) {
        let payerOption = document.createElement("option");
        payerOption.text = member;
        payerOption.value = member;
        payerOption.id = member + 'PayerOption';
        payerSelect.appendChild(payerOption);
    }
    //総額
    let amoundSelect = document.getElementById('amount');
    amoundSelect.min = '0';
    //丸め単位
    let roundSelect = document.getElementById('round');
    // roundSelect.min = '0';
    // roundSelect.step = '50';
    const roundList = [1, 5, 10, 50, 100, 500, 1000];
    for(val of roundList){
        let roundOption = document.createElement('option');
        roundOption.text = val;
        roundOption.id = val + 'Option';
        roundSelect.appendChild(roundOption);
    }
    // roundSelect.valueAsNumber = 0;
    //結果
    let resultTable = document.getElementById('result_table');
    for (member of memberList) {
        //空の行要素を先に作成tr
        let tr = document.createElement("tr");
        tr.id = member + 'Row';
        // メンバー名
        let nameTd = document.createElement("td");      //新しいtd要素を作って変数tdに格納
        let nameLabel = document.createElement("label");  //tdに何か追加。
        nameLabel.type = 'text';
        nameLabel.textContent = member;
        nameLabel.id = member + 'Name';
        nameTd.appendChild(nameLabel);        //tdにinpを追加
        tr.appendChild(nameTd);         //trにtdを追加
        //支払い金額
        let paymentTd = document.createElement('td');
        let paymentDiv = document.createElement('div');
        let paymentInput = document.createElement('input');
        paymentInput.type = 'number';
        paymentInput.id = member + 'Payment';
        paymentInput.style.width = '50px';
        paymentDiv.appendChild(paymentInput)
        let yen = document.createElement('span');
        yen.textContent = '円';
        paymentDiv.appendChild(yen);        
        
        paymentTd.appendChild(paymentDiv);
        tr.appendChild(paymentTd)
        // 傾斜
        let ratioTd = document.createElement('td');
        let ratioInput = document.createElement('input');        
        ratioInput.type = 'number';
        ratioInput.id = member + 'Ratio';
        ratioInput.min = '0';
        ratioInput.max = '100';
        ratioInput.step = '1';
        ratioInput.style.width = '30px'
        ratioInput.valueAsNumber = 1
        ratioTd.appendChild(ratioInput);
        tr.appendChild(ratioTd)

        //金額固定
        let switchTd = document.createElement('td');
        let switchLabel = document.createElement('label');
        switchLabel.htmlFor = member + 'FixToggle';
        switchLabel.className = 'switch_label';
        let switchDiv = document.createElement('div');
        switchDiv.className = 'switch'
        let switchInput = document.createElement('input');
        switchInput.type = 'checkbox';
        switchInput.id = member + 'FixToggle';
        let circleDiv = document.createElement('div');
        circleDiv.className = 'circle';
        let baseDiv = document.createElement('div');
        baseDiv.className = 'base';
        switchDiv.appendChild(switchInput);
        switchDiv.appendChild(circleDiv);
        switchDiv.appendChild(baseDiv);
        switchLabel.appendChild(switchDiv);
        switchTd.appendChild(switchLabel);
        tr.appendChild(switchTd);
        // console.log(1);

        //端数
        let switchTd2 = document.createElement('td');
        let switchLabel2 = document.createElement('label');
        switchLabel2.htmlFor = member + 'FracToggle';
        switchLabel2.className = 'switch_label';
        let switchDiv2 = document.createElement('div');
        switchDiv2.className = 'switch'
        let switchInput2 = document.createElement('input');
        switchInput2.type = 'checkbox';
        switchInput2.id = member + 'FracToggle';
        let circleDiv2 = document.createElement('div');
        circleDiv2.className = 'circle';
        let baseDiv2 = document.createElement('div');
        baseDiv2.className = 'base';
        switchDiv2.appendChild(switchInput2);
        switchDiv2.appendChild(circleDiv2);
        switchDiv2.appendChild(baseDiv2);
        switchLabel2.appendChild(switchDiv2);
        switchTd2.appendChild(switchLabel2);
        tr.appendChild(switchTd2);
        //完成したtrをtableに追加
        resultTable.appendChild(tr);
    }
    let payer = document.getElementById('payer').value;
    let payerRow = document.getElementById(payer + 'Row');
    payerRow.style = 'background-color: #FFCCCC;';
}


function calculate() {
    if (document.getElementById('payer').value == '' || document.getElementById('payer').value == null) {
        alert('支払いした人を入力してください');
        console.error('PayerNotFoundError');
        throw new Error('PayerNotFoundError');
    }
    // if (document.getElementById('content').value == '' || document.getElementById('content').value == null) {
    //     alert('支払い内容を入力してください');
    //     console.error('ContentNotFoundError');
    //     throw new Error('ContentNotFoundError');
    // }
    if (document.getElementById('amount').value == '' || document.getElementById('amount').value == null) {
        alert('支払い金額を入力してください');
        console.error('AmountNotFoundError');
        throw new Error('AmountNotFoundError');       
    }

    //支払い者をハイライト
    let memberCount = memberList.length;
    let totalAmount = parseFloat(document.getElementById('amount').value);


    console.log('--- calculate start ---');

    //金額固定を除外
    let unfixedList = [];
    for (member of memberList) {
        let fixToggle = document.getElementById(member + 'FixToggle');
        if (fixToggle.checked) {
            console.log( member + ' fixed');
            let fixedPayment = document.getElementById(member + 'Payment').value;
            // console.log(fixedPayment);
            preTotal = totalAmount;
            totalAmount -= fixedPayment;
            console.log('total amount: ' + preTotal + ' => ' + totalAmount);
            continue
        }
        unfixedList.push(member)
    }
    // 参加者の名前と割合を取得
    let membersRatio = [];
    for (member of unfixedList) {
        let name = document.getElementById(member + 'Name').textContent;
        let ratio = parseFloat(document.getElementById(member + 'Ratio').valueAsNumber);
        membersRatio.push({ name: name, ratio: ratio });
    }
    // 各参加者ごとの支払い金額を計算
    let totalRatio = membersRatio.reduce((sum, member) => sum + member.ratio, 0);
    let roundUnit = parseInt(document.getElementById('round').value);
    console.log(roundUnit);
    let unfixedCount = unfixedList.length;
    let resultList = [];
    for (let i = 0; i < unfixedCount; i++) {
        let amountPerPerson = (totalAmount * membersRatio[i].ratio) / totalRatio;
        let fracToggle = document.getElementById(unfixedList[i] + 'FracToggle');
        // let resultText = "¥" + amountPerPerson.toFixed(2);
        let result = roundPayment(amountPerPerson, roundUnit, fracToggle.checked);
        resultList.push(result)
    }
    console.log("sum amount" + resultList.reduce((sum, element) => sum + element, 0));
    
    for (let i = 0; i < unfixedCount; i++) {
        document.getElementById(unfixedList[i] + 'Payment').value = resultList[i];   
    }
    console.log('--- calculate finish ---');

    // let buttons = document.getElementById('buttons');
    // let registerButton = document.createElement('button');
    // registerButton.textContent = '登録';
    // registerButton.onclick = register;
    // buttons.appendChild(registerButton);

}


function roundPayment(payment, roundUnit, option) {
    if (roundUnit == 0) {
        roundUnit = 1;
    }
    remain = payment % roundUnit;
    if (option) { //切り上げる
        payment -= remain;
        payment += roundUnit;
    }else{ //切り下げる
        payment -= remain;
    }
    return payment;
}

function register() {
    try {
        calculate();
    } catch (error) {
        console.error('[' + error + ']' + ' not calculated');
        return;
    }
    console.log('登録されました');
}
// // 参加者の数が変更されたときに入力フィールドを更新
// document.getElementById('submit').addEventListener('click', viewBuilder);

// 初回にも一度呼び出す
viewBuilder();

let select = document.querySelector('[name="member"]')
select.onchange = event => {
    let payer = document.getElementById('payer').value;
    for(member of memberList){
        let memberRow = document.getElementById(member + 'Row');
        memberRow.style = 'background-color: transparent;'
    }
    let payerRow = document.getElementById(payer + 'Row');
    payerRow.style = 'background-color: #FFCCCC;';
}

