import { app, database, ref_, set_, get_, update_, push_, goOffline_}  from "../../../../../js/master.js";

// アプリケーションが閉じられたときに呼ばれる処理
window.onbeforeunload = function () {
    // Firebase Realtime Databaseへの接続を切断
    goOffline_(database);
};

// 画面遷移の行き先を指定
const groupId = new URLSearchParams(window.location.search).get('id');
console.log(groupId);
const logo = document.getElementById("logo");
const top = document.getElementById("top");
const home = document.getElementById("home");
const back = document.getElementById("back");
logo.href = `../group.html?id=${groupId}`;
home.href = `../group.html?id=${groupId}`;
back.href = `../group.html?id=${groupId}`;
top.onclick = showAlert;

// htmlとの連携
let memberDiv = document.getElementById('member');
let groupDiv = document.getElementById('group');
const calcButton = document.getElementById("calculateButton");
calcButton.onclick = calculate;
const saveButton = document.getElementById("saveButton");
saveButton.onclick = save;
const allButton = document.getElementById("allButton");
allButton.onclick = allCheck;


// グループの情報
let groupName = ""
let memberList = ["秀島", "川崎", "佐々木", "福田", "松島"];
// let memberList = ['OB1','OB2',
//  '3男総務', '3男1', '3男2', '3男3',
// '3女1','3女2','3女3',
// '2男1','2男2','2男3','2男4',
// '2女1','2女2',
// '1男1','1男2','1男3','1男4','1男5',
// '1女1','1女2','1女3','1女4','1女5',];

let preResult = { // 前回までの割り勘の結果を格納するjson
    "秀島":0, 
    "川崎":0, 
    "佐々木":0, 
    "福田":0, 
    "松島":0
};
let resultDict = {};// 今回の割り勘結果を格納するjson
let pushResult = {};
// データベースへの参照
let groupRef = ref_(database,'groups/' + groupId);


let getFlag = false;


//関数/////////////////////////////////////////////////////////////////////////////////////////////
//画面生成
function viewBuilder() {
    //メンバー表示
    for (let member of memberList) {
        let memberSpan = document.createElement('span');
        memberSpan.textContent = member;
        memberSpan.id = member + 'Span';
        memberSpan.style = 'background-color: white; margin-right:10px; border: solid 1px black; border-width: 2px; border-radius: 10px; padding: 3px;';
        // memberSpan.style.border = 'solid'
        memberDiv.appendChild(memberSpan);
    }
    //支払い人
    let payerSelect = document.getElementById("payer");
    for(let member of memberList) {
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
    const roundList = [1, 5, 10, 50, 100, 500, 1000];
    for(let val of roundList){
        let roundOption = document.createElement('option');
        roundOption.text = val;
        roundOption.id = val + 'Option';
        roundSelect.appendChild(roundOption);
    }
    //結果
    let resultTableBody = document.getElementById('tableBody');
    for (let member of memberList) {
        //各メンバーの行要素
        let tr = document.createElement("tr");
        tr.id = member + 'Row';
        //チェックボックス
        let checkTd = document.createElement('td');
        let checkInput = document.createElement('input');
        checkInput.type = 'checkbox';
        checkInput.id = member + 'CheckBox';
        checkInput.className = 'checkbox'
        checkInput.onclick = function(){ //クリックでチェックをつける
            toggleCheckbox(this);
        }
        checkTd.appendChild(checkInput);
        tr.appendChild(checkTd);
        
        // メンバー名
        let nameTd = document.createElement("td");
        nameTd.onmousedown = function(){ //クリック長押しで選択スタート
            startSelection(this);
        };
        nameTd.onmouseover = function(){ //長押し中は選択
            selectCell(this);
        };
        nameTd.onmouseup = function(){ //長押し終了で選択終わり
            endSelection();
        };
        nameTd.textContent = member;
        nameTd.id = member + 'Name';
        tr.appendChild(nameTd);         //trにtdを追加
        //支払い金額
        let paymentTd = document.createElement('td');
        let paymentDiv = document.createElement('div');
        let paymentInput = document.createElement('input');
        paymentInput.type = 'number';
        paymentInput.id = member + 'Payment';
        paymentInput.min = '0';
        paymentInput.style.width = '90px';
        paymentDiv.appendChild(paymentInput)
        const yen = document.createElement('span');
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
        ratioInput.style.width = '55px';
        ratioInput.valueAsNumber = 1;
        ratioTd.appendChild(ratioInput);
        tr.appendChild(ratioTd);
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
        switchInput.className = 'toggle'
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
        //端数
        let switchTd2 = document.createElement('td');
        let switchLabel2 = document.createElement('label');
        switchLabel2.htmlFor = member + 'FracToggle';
        switchLabel2.className = 'switch_label';
        let switchDiv2 = document.createElement('div');
        switchDiv2.className = 'switch'
        let switchInput2 = document.createElement('input');
        switchInput2.type = 'checkbox';
        switchInput2.className = 'toggle'
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
        resultTableBody.appendChild(tr);
    }
    // 支払い者の表示を変える
    let payer = document.getElementById('payer').value;
    let payerRow = document.getElementById(payer + 'Row');
    payerRow.style = 'background-color: #FFCCCC;';
    let fracToggle = document.getElementById(payer + 'FracToggle');
    fracToggle.checked = true;
}

//精算
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
        // throw new Error('AmountNotFoundError');
        document.getElementById('amount').value = 33333;
    }
    let fracCount = 0;
    for(let member of memberList){
        if (document.getElementById(member + 'FracToggle').checked) {
            fracCount ++
        }
    }
    if (fracCount == 0) {
        alert('一名以上端数を支払う人を設定してください');
        console.error('FractionNotFoundError');
        let payer = document.getElementById('payer').value;
        document.getElementById(payer + 'FracToggle').checked = true;
        throw new Error('FractionNotFoundError');
    }

    //計算開始
    console.log('--- calculate start ---');
    let totalAmount = parseFloat(document.getElementById('amount').value);
    let initialAmount = totalAmount;

    //金額固定を除外
    let unfixedList = [];
    for (let member of memberList) {
        let fixToggle = document.getElementById(member + 'FixToggle');
        if (fixToggle.checked) {
            console.log( member + ' fixed');
            let fixedPayment = document.getElementById(member + 'Payment').value;
            preTotal = totalAmount;
            totalAmount -= fixedPayment;
            console.log('total amount: ' + preTotal + ' => ' + totalAmount);
            continue
        }
        unfixedList.push(member)
    }
    // 参加者の名前と割合を取得
    let membersRatio = [];
    for (let member of unfixedList) {
        let name = document.getElementById(member + 'Name').textContent;
        let ratio = parseFloat(document.getElementById(member + 'Ratio').valueAsNumber);
        membersRatio.push({ name: name, ratio: ratio });
    }
    // 各参加者ごとの支払い金額を計算
    let totalRatio = membersRatio.reduce((sum, member) => sum + member.ratio, 0);
    let roundUnit = parseInt(document.getElementById('round').value);
    console.log('roundUnit' + roundUnit);
    let unfixedCount = unfixedList.length;
    let resultList = [];
    for (let i = 0; i < unfixedCount; i++) {
        let amountPerPerson = (totalAmount * membersRatio[i].ratio) / totalRatio;
        // let resultText = "¥" + amountPerPerson.toFixed(2);
        let dutchOption = document.getElementById('option'); //計算方法のオプション
        let result = roundPayment(amountPerPerson, roundUnit, dutchOption.value);
        resultList.push(result)
    }
    console.log(resultList);
    //一回目の計算の合計
    let sum = resultList.reduce((sum, element) => sum + element, 0);
    console.log("sum amount: " + sum);
    let diff = totalAmount - sum; //差分が発生
    console.log('diff: ' + diff);
    // 差分を端数を支払う人に均等に割り当てる
    let fracMemberList = []
    for (let i = 0; i < unfixedCount; i++) {
        let fracToggle = document.getElementById(unfixedList[i] + 'FracToggle');
        if (fracToggle.checked) {
            fracMemberList.push(unfixedList[i]);
        }
    }
    for (let i = 0; i < fracMemberList.length; i++) {
        let diffPerPerson = Math.floor(diff/fracMemberList.length);
        console.log('diffperperson: ' + diffPerPerson);
        resultList[unfixedList.indexOf(fracMemberList[i])] += diffPerPerson;
    }
    //差分を等分した後の結果
    sum = resultList.reduce((sum, element) => sum + element, 0);
    diff = totalAmount - sum; //まだ差分がある
    console.log('diff: ' + diff);
    //それでも残った差分を端数を支払う人にランダムで分配
    for (let i = 0; i < diff; i++) {
        console.log(fracMemberList);
        let randomMember = fracMemberList[Math.floor(Math.random() * fracMemberList.length)]
        console.log(randomMember);
        resultList[unfixedList.indexOf(randomMember)] += 1*diff/Math.abs(diff);
        fracMemberList.splice(fracMemberList.indexOf(randomMember), 1);
    }
    sum = resultList.reduce((sum, element) => sum + element, 0);
    diff = totalAmount - sum;
    console.log('diff: ' + diff); //これでやっと差分が０

    console.log(resultList);
    
    // 結果表示
    for (let i = 0; i < unfixedCount; i++) {
        document.getElementById(unfixedList[i] + 'Payment').value = resultList[i];   
    }
    console.log('--- calculate finish ---');
    resultDict = {};
    for (let i=0; i< memberList.length; i++) {
        resultDict[String(memberList[i])]= resultList[i];
    }
    console.log(resultDict);
    for (let key in preResult){
        if (resultDict.hasOwnProperty(key)){
            pushResult[key] = preResult[key] + resultDict[key];
        }
    }
    console.log(result);
}

// 丸めこみの関数
function roundPayment(payment, roundUnit, option) {
    if (roundUnit == 0) {
        roundUnit = 1;
    }
    let remain = payment % roundUnit;
    switch (option) {
        case 'ceil': //切り上げる
            payment -= remain;
            payment += roundUnit;            
            break;
        case 'round': //四捨五入
            if (remain/roundUnit < 0.5) { //四捨
                payment -= remain;
            }else{ //五入
                payment -= remain;
                payment += roundUnit;            
            }
            break
        case 'floor': //切り下げる 
            payment -= remain;
            break;
    }
    return payment;
}

//保存
function save() {
    try {
        calculate();
        let creditor = document.getElementById("payer").value;
        for (let member of memberList){
            if (member == creditor){
                continue;
            }
            let debtor = member;
            let newHistoryRef = push_(ref_(database, 'groups/' + groupId +'/history'));
            let amount = document.getElementById(member + "Payment").value;
            let content = document.getElementById("content").value;
            let data = {
                "creditor": creditor,
                "amount": amount,
                "debtor": debtor,
                "content": content
            };    
            set_(newHistoryRef, data)
            .then(() => {
                console.log("データが正常に書き込まれました");
                // resolve();
            })
            .catch((error) => {
                console.error("データの書き込みに失敗しました", error);
                reject(error);
            });    
        }
        alert("保存されました")
    } catch (error) {
        console.error('[' + error + ']' + ' not calculated');
        return;
    }
    console.log('保存されました');
}

// 選択された行の入力内容をリアルタイム同期する
function addSyncEvent(cell) {
    var paymentId = cell.id.replace('CheckBox', 'Payment');
    var paymentInput = document.getElementById(paymentId);
    var ratioId = cell.id.replace('CheckBox', 'Ratio');
    var ratioInput = document.getElementById(ratioId);
    var fixId = cell.id.replace('CheckBox', 'FixToggle');
    var fixInput = document.getElementById(fixId);
    if (cell.checked) { //選択されていたら入力内容を同期する
        paymentInput.addEventListener('input', syncPayment);
        ratioInput.addEventListener('input', syncRatio);
        fixInput.addEventListener('input', syncFix);
    } else {
        paymentInput.removeEventListener('input', syncPayment);
        ratioInput.removeEventListener('input', syncRatio);
        fixInput.removeEventListener('input', syncFix);
    }
}

// 入力内容を同期する関数
//割り勘金額の同期
function syncPayment() {
    var checkboxes = document.querySelectorAll('input[class="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        var paymentId = checkbox.id.replace('CheckBox', 'Payment');
        var paymentInput = document.getElementById(paymentId);
        if (checkbox.checked && paymentInput !== this) {
            // チェックされていて、かつ同じ入力欄でない場合、入力内容を同期する
            paymentInput.value = this.value;
        }
    }, this);
}
//傾斜比率の同期
function syncRatio() {
    var checkboxes = document.querySelectorAll('input[class="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        var ratioId = checkbox.id.replace('CheckBox', 'Ratio');
        var ratioInput = document.getElementById(ratioId);

        if (checkbox.checked && ratioInput !== this) {
            // チェックされていて、かつ同じ入力欄でない場合、入力内容を同期する
            ratioInput.value = this.value;
        }
    }, this);
}
//金額固定トグルの同期
function syncFix() {
    var checkboxes = document.querySelectorAll('input[class="checkbox"]');
    checkboxes.forEach(function(checkbox){
        var fixId = checkbox.id.replace('CheckBox', 'FixToggle');
        // console.log(fixId);
        var fixInput = document.getElementById(fixId);
        if (checkbox.checked && fixInput != this) {
            fixInput.checked = this.checked;
        }
    }, this);
}

// メンバーを複数選択するための関数
function startSelection(cell) {
    isSelecting = true;
    toggleCellSelection(cell);
}
function selectCell(cell) {
    if (isSelecting) {
        toggleCellSelection(cell);
    }
}
function endSelection() {
    isSelecting = false;
    var checkboxes = document.querySelectorAll('input[class="checkbox"]');
    let checkExist = false;
    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            checkExist = true;
        }
    })
    let allButton = document.getElementById('allButton');
    allButton.innerHTML = (!checkExist) ? '<small>全選択</small>' : '<small>全解除</small>';
    allButton.className = (!checkExist) ? 'allButton' : 'allClear';
    // console.log(allButton.className); 
}
// 選択されたメンバーの背景色とチェックボックスを管理
function toggleCellSelection(cell) {
    cell.classList.toggle("selected");
    toggleCheckboxInSameRow(cell);
}
function toggleCheckboxInSameRow(cell) {
    const row = cell.parentNode;
    const checkboxCell = row.querySelector('td:nth-child(1) input[class="checkbox"]');
    // checkboxCell.checked = !checkboxCell.checked;
    checkboxCell.checked = (cell.className == 'selected') ? true : false ;
    addSyncEvent(checkboxCell);
}
//一括選択・解除
function allCheck() {
    let allButton = document.getElementById('allButton');
    allButton.innerHTML = (allButton.className=='allClear') ? '<small>全選択</small>' : '<small>全解除</small>';
    allButton.className = (allButton.className == 'allClear') ? "allButton": "allClear";
    var checkboxes = document.querySelectorAll('input[class="checkbox"]');
    let checkExist = false;
    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            checkExist = true;
        }
    })
    checkboxes.forEach(function (checkbox) {
        checkbox.checked = !checkExist;
        let nameId = checkbox.id.replace('CheckBox', 'Name');
        let nameTd = document.getElementById(nameId);
        if (checkbox.checked) {
            nameTd.className = 'selected';
        }else if (nameId.className != 'selected'){
            nameTd.className = '';
        }
    })    
}
// top alert
function showAlert() {
    var result = confirm('注意 グループから抜けることになります');
    if (result){
        top.href = `../../../../index.html`;
    }
}



// main//////////////////////////////////////////////////////////////////////////////////////////////
// 画面生成
let isSelecting = false;
// データベースから情報を取得
get_(groupRef)
    .then((snapshot) => {
    let data = snapshot.val();
    groupName = data["groupName"];
    // preResult = 

    console.log("groupname:" + groupName);
    memberList = data["groupMember"];
// memberList = ["s","d"]
// groupName = "sss"
    //グループ名表示
    groupDiv.innerHTML = 'グループ名：' + groupName + "</br>";

    // 画面生成
    viewBuilder();
    let select = document.querySelector('[name="member"]')
    select.onchange = event => {
        let payer = document.getElementById('payer').value;
        for(let member of memberList){
            let memberRow = document.getElementById(member + 'Row');
            memberRow.style = 'background-color: transparent;'
            let fracToggle = document.getElementById(member + 'FracToggle');
            fracToggle.checked = false;

        }
        let payerRow = document.getElementById(payer + 'Row');
        payerRow.style = 'background-color: #FFCCCC;';
        let fracToggle = document.getElementById(payer + 'FracToggle');
        fracToggle.checked = true;
    }

    //同時編集のイベント通知を設定
    // 同期するチェックボックスの要素を取得
    var checkboxes = document.querySelectorAll('input[class="checkbox"]');
    // 各チェックボックスに対してイベントリスナーを追加
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            let nameId = checkbox.id.replace('CheckBox', 'Name');
            let nameTd = document.getElementById(nameId);
            if (checkbox.checked) {
                nameTd.className = 'selected';
            }else if (nameId.className != 'selected'){
                nameTd.className = '';
            }
            // チェックボックスが変更されたら、対応する入力欄にイベントリスナーを追加または削除
            addSyncEvent(checkbox);
            let allButton = document.getElementById('allButton');
            allButton.innerHTML = (allButton.className=='allClear') ? '<small>全選択</small>' : '<small>全解除</small>';
            allButton.className = (allButton.className == 'allClear') ? "allButton": "allClear";
        });
    });

    // トグルによる表示・非表示の切り替え
    document.getElementById('toggleButton').addEventListener('click', function() {
        var content = document.getElementById('toggleContent');
        if (content.style.display === 'none') {
            content.style.display = 'block';
        } else {
            content.style.display = 'none';
        }
    });
})
    .catch((error) => {
        console.log("ID:" + groupId);
        console.error("データの読み取りに失敗しました", error);
});







// note//
// TODO: 金額固定と端数調整が共存しないようにする
// TODO: チェックが入らないと編集できないようにする