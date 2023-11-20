// 定数・変数 (データベースで共有した情報)
let groupName = "飲み会"
let memberList = ["秀島", "川崎", "佐々木", "福田", "松島"];
let payer = '秀島';
let memberDiv = document.getElementById('member');
let groupDiv = document.getElementById('group');
let resultDict = {
    "秀島":6665,
    "川崎":6667,
    "佐々木":6667,
    "福田":6667,
    "松島":6667
}

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
    let resultTable = document.getElementById('result_table');
    for (member of memberList) {
        
        //各メンバーの行要素
        let tr = document.createElement("tr");
        tr.id = member + 'Row';    
        // メンバー名
        let nameTd = document.createElement("td");
        if (member == payer) {
            nameTd.textContent = member;
        }else{
        nameTd.textContent = member + " --> " + payer;
        }
        nameTd.id = member + 'Name';
        tr.appendChild(nameTd);         //trにtdを追加
        //支払い金額
        let paymentTd = document.createElement('td');
        let paymentDiv = document.createElement('div');
        let paymentLabel = document.createElement('label');
        paymentLabel.type = 'number';
        paymentLabel.id = member + 'Payment';
        paymentLabel.style.width = '50px';
        paymentLabel.textContent = resultDict[member];
        paymentDiv.appendChild(paymentLabel)
        const yen = document.createElement('span');
        yen.textContent = '円';
        paymentDiv.appendChild(yen);        
        paymentTd.appendChild(paymentDiv);
        tr.appendChild(paymentTd);    
        //完成したtrをtableに追加
        resultTable.appendChild(tr);
    }
    // 支払い者の表示を変える
    let payerRow = document.getElementById(payer + 'Row');
    payerRow.style = 'background-color: #FFCCCC;';
    let fracToggle = document.getElementById(payer + 'FracToggle');
    fracToggle.checked = true;
}
//登録
function register() {
    delete resultDict[payer];
    console.log(resultDict);
    console.log('登録されました');

}
//戻る
function back() {
    console.log('前のページに戻る');
}


// main ////////////////////////////////////////
viewBuilder();

