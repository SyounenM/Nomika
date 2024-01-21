import {database, ref_, set_, get_, update_, push_, goOffline_, remove_}  from "../../../../../js/master.js";
// アプリケーションが閉じられたときに呼ばれる処理
window.onbeforeunload = function () {
    // Firebase Realtime Databaseへの接続を切断
    goOffline_(database);
};

// 画面遷移の行き先を指定
const groupId = new URLSearchParams(window.location.search).get('id');
console.log(groupId);
const historyId = new URLSearchParams(window.location.search).get('historyId');
const icon = document.getElementById("icon");
const logo = document.getElementById("logo");
const top = document.getElementById("top");
const home = document.getElementById("home");
const back = document.getElementById("back");
const remove = document.getElementById("remove");
remove.style.display = "none";
icon.href = `../group.html?id=${groupId}`;
logo.href = `../group.html?id=${groupId}`;
home.href = `../group.html?id=${groupId}`;
back.href = `../group.html?id=${groupId}`;
top.onclick = showAlert;


// 画面高さ
var dispScope = document.getElementById("result");
var background = document.getElementById("background-warikan");
var dispHeight = 430;
var backHeight;

// 高さの変更
function changeHeight() {
    const offsetTop = back.offsetTop;
    // back.style.top = offsetTop - 2000 + "px";
    console.log(offsetTop);
    backHeight = offsetTop + 1700;
    background.style.height = backHeight + "px";
}
function changeFooter(){
    const footer = document.getElementById("footer");
    console.log("footer", footer.offsetWidth);
    var viewportWidth = window.innerWidth;
    footer.style.width = viewportWidth + 10 + "px";
    console.log("footer", footer.offsetWidth);
}

// htmlとの連携
const calcButton = document.getElementById("calculateButton");
calcButton.onclick = calculate;
const saveButton = document.getElementById("saveButton");
saveButton.onclick = save;
const allButton = document.getElementById("allButton");
allButton.onclick = allCheck;

// グループの情報
let groupName = ""
let memberList = ["秀島", "川崎", "佐々木", "福田", "松島"];
let totalAmount = 0;
let content = "";
let creditor = "";
let resultDict = {};
let roundUnit = 0;
let option = "";
let fixedList =[];
let fracList = [];
let ratioDict = {};

// データベースへの参照
let groupRef = ref_(database,'groups/' + groupId);
let historyRef = ref_(database,'groups/' + groupId + '/history/' + historyId);


//flgs
let flgConfirm = true;
let isSelecting = false;


//関数/////////////////////////////////////////////////////////////////////////////////////////////
//画面生成
function viewBuilder() {
    // //グループ名表示
    // groupDiv.innerHTML = 'グループ名：' + groupName + "</br>";
    // //メンバー表示
    // for (let member of memberList) {
    //     let memberSpan = document.createElement('span');
    //     memberSpan.textContent = member;
    //     memberSpan.id = member + 'Span';
    //     memberSpan.style = 'background-color: white; margin-right:10px; border: solid 1px black; border-width: 2px; border-radius: 10px; padding: 3px;';
    //     // memberSpan.style.border = 'solid'
    //     memberDiv.appendChild(memberSpan);
    //     // dispHeight += 20; //表示部分高さの変更
    // }
    //支払い人
    let payerSelect = document.getElementById("payer");
    for(let member of memberList) {
        let payerOption = document.createElement("option");
        payerOption.text = member;
        payerOption.value = member;
        payerOption.id = member + 'PayerOption';
        payerSelect.appendChild(payerOption);
    }
    if (creditor != ""){
        payerSelect.value = creditor;
    }
    // 内容
    let contentInput = document.getElementById('content');
    if (content != ""){
        contentInput.value = content;
    }
    //総額
    let amountSelect = document.getElementById('amount');
    amountSelect.min = '0';
    if (totalAmount != 0){
        amountSelect.value = totalAmount;
    }
    //丸め単位
    let roundSelect = document.getElementById('round');
    const roundList = [1, 5, 10, 50, 100, 500, 1000];
    for(let val of roundList){
        let roundOption = document.createElement('option');
        roundOption.text = val;
        roundOption.id = val + 'Option';
        roundSelect.appendChild(roundOption);
    }
    if (roundUnit != 0){
        roundSelect.value = roundUnit;
    }

    //丸めオプション
    let optionSelect = document.getElementById('option');
    if (option != ""){
        optionSelect.value = option;
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
            // checkInput.toggle();
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
        nameTd.ontouchmove = function (event) {
            event.preventDefault();
            selectCell(this);
        }
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
        paymentInput.id = member + 'Payment';
        paymentInput.type = 'number';
        paymentInput.min = '0';
        paymentInput.style.width = '90px';
        paymentInput.setAttribute('readonly', 'true');
        paymentInput.style.border = 'none';
        paymentInput.style.outline = 'none';
        paymentInput.style.backgroundColor = 'transparent';  
        console.log("reuslt:" + resultDict);
        if (Object.keys(resultDict).length){
            paymentInput.value = resultDict[member];
        }  
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
        ratioInput.setAttribute('readonly', 'true');
        ratioInput.style.border = 'none';
        ratioInput.style.outline = 'none';
        ratioInput.style.backgroundColor = 'transparent';  
        if (Object.keys(ratioDict).length) {
            ratioInput.value = ratioDict[member];
        }
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
        console.log(fixedList);
        if (fixedList.length != 0){
            console.log("fix");
            if (fixedList.includes(member)){
                switchInput.checked = true;
            }else{
                switchInput.checked = false;
            }
        }
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
        if (fracList != []){
            if(fracList.includes(member)){
                switchInput2.checked = true;
            }else{
                switchInput2.checked = false;
            }
        }
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
    payerRow.className = 'payerRow'
    let fracToggle = document.getElementById(payer + 'FracToggle');
    fracToggle.checked = true;

    // 表示部分の高さ設定
    // dispScope.style.height = dispHeight + "px";
    changeHeight(); // 背景部分の高さの変更
    changeFooter();
}

//精算
function calculate() {
    flgConfirm = true;
    if (document.getElementById('payer').value == '' || document.getElementById('payer').value == null) {
        alert('支払いした人を入力してください');
        console.error('PayerNotFoundError');
        throw new Error('PayerNotFoundError');
    }
    if (document.getElementById('content').value == '' || document.getElementById('content').value == null) {
        alert('支払い内容を入力してください');
        console.error('ContentNotFoundError');
        flgConfirm = false;
        throw new Error('ContentNotFoundError');
    }
    if (document.getElementById('amount').value == '' || document.getElementById('amount').value == null) {
        alert('支払い金額を入力してください');
        console.error('AmountNotFoundError');
        flgConfirm = false;
        throw new Error('AmountNotFoundError');
        // document.getElementById('amount').value = 33333;
    } else {
        flgConfirm = true;
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
    totalAmount = parseFloat(document.getElementById('amount').value);

    //金額固定を除外
    let unfixedList = [];
    fixedList =[]
    for (let member of memberList) {
        let fixToggle = document.getElementById(member + 'FixToggle');
        if (fixToggle.checked) {
            console.log( member + ' fixed');
            let fixedPayment = document.getElementById(member + 'Payment').value;
            let preTotal = totalAmount;
            totalAmount -= fixedPayment;
            console.log('total amount: ' + preTotal + ' => ' + totalAmount);
            fixedList.push(member);
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
    console.log(totalRatio);
    let roundUnit = parseInt(document.getElementById('round').value);
    console.log('roundUnit' + roundUnit);
    let unfixedCount = unfixedList.length;
    let resultList = [];
    for (let i = 0; i < unfixedCount; i++) {
        let amountPerPerson = (totalAmount * membersRatio[i].ratio) / totalRatio;
        // let resultText = "¥" + amountPerPerson.toFixed(2);
        console.log(amountPerPerson);
        let dutchOption = document.getElementById('option'); //計算方法のオプション
        let result = roundPayment(amountPerPerson, roundUnit, dutchOption.value);
        resultList.push(result)
        console.log(result);
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
    for (let member of memberList){
        let payment = document.getElementById(member + 'Payment').value;
        resultDict[member] = payment;
    }
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
            if (remain != 0){
                payment += roundUnit;          
            }  
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
        let content = document.getElementById("content").value;

        let data = [];
        let debtorList = [...memberList];
        debtorList.splice(debtorList.indexOf(creditor));
        // 参加者の名前と割合を取得
        ratioDict = {};
        for(let member of memberList) {
            let name = document.getElementById(member + 'Name').textContent;
            let ratio = parseFloat(document.getElementById(member + 'Ratio').valueAsNumber);
            ratioDict[name] = ratio;
        }
        //金額固定者
        fixedList = [];
        for (let member of memberList) {
            let fixToggle = document.getElementById(member + 'FixToggle');
            if (fixToggle.checked) {
                fixedList.push(member)                
            }
        }
        console.log(fixedList);
        // 差分を端数を支払う人
        fracList = []
        for (let member of memberList) {
            let fracToggle = document.getElementById(member + 'FracToggle');
            if (fracToggle.checked) {
                fracList.push(member);
            }
        }
        roundUnit = parseInt(document.getElementById('round').value);

        option = document.getElementById('option').value;
        //合計金額
        let totalAmount = document.getElementById("amount").value;
        
        data.push({
            "method": "warikan",
            "creditor": creditor,
            "amount": totalAmount,
            "debtor": debtorList,
            "content": content,
            "resultDict" :resultDict,
            "roundUnit": roundUnit,
            "option": option,
            "ratio": ratioDict,
            "fixedMember": fixedList,
            "fracMember": fracList
        })
        for (let member of memberList){
            if (member == creditor){
                continue;
            }
            let debtor = member;
            let amount = document.getElementById(member + "Payment").value;
            console.log(amount);
            amount = Number(amount);
            console.log(typeof amount);
            console.log(amount);
            data.push({
                "creditor": creditor,
                "amount": amount,
                "debtor": debtor,
                "content": content
            });     
        }
        if (historyId == null){
            historyRef = push_(ref_(database, 'groups/' + groupId +'/history'));
            console.log(historyRef.key);
        }else {
            historyRef = ref_(database,'groups/' + groupId + '/history/' + historyId);
        }
        set_(historyRef, data)
        .then(() => {
            console.log("データが正常に書き込まれました");
            // resolve();
        })
        .catch((error) => {
            console.error("データの書き込みに失敗しました", error);
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
    chengeViewOfCell(cell);
}
function selectCell(cell) {
    if (isSelecting) {
        chengeViewOfCell(cell);
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
    allButton.innerHTML = (!checkExist) ? '<small>全編集</small>' : '<small>全解除</small>';
    allButton.className = (!checkExist) ? 'allButton' : 'allClear';
    // console.log(allButton.className); 
}
// 選択されたメンバーの背景色とチェックボックスを管理
function chengeViewOfCell(cell) {
    cell.classList.toggle("selected");
    changeViewOfRow(cell);
}
function changeViewOfRow(cell) {
    const row = cell.parentNode;
    const checkboxCell = row.querySelector('td:nth-child(1) input[class="checkbox"]');
    // checkboxCell.checked = !checkboxCell.checked;
    checkboxCell.checked = (cell.className == 'selected') ? true : false ;
    const inputId = checkboxCell.id.replace('CheckBox', 'Payment');
    const ratioId = checkboxCell.id.replace('CheckBox', 'Ratio');
    
    const inputElement = document.getElementById(inputId);
    const ratioElement = document.getElementById(ratioId);
    if (checkboxCell.checked) {
        // チェックされた場合、入力欄を表示
        inputElement.removeAttribute('readonly', 'false');
        inputElement.style.border = '1px solid black';
        inputElement.style.backgroundColor = 'white';   
        // チェックされた場合、入力欄を表示
        ratioElement.removeAttribute('readonly', 'false');
        ratioElement.style.border = '1px solid black';
        ratioElement.style.backgroundColor = 'white';                
    } else {
        // チェックされていない場合、入力欄を非表示
        inputElement.setAttribute('readonly', 'true');
        inputElement.style.border = 'none';
        inputElement.style.outline = 'none';
        inputElement.style.backgroundColor = 'transparent';
        ratioElement.setAttribute('readonly', 'true');
        ratioElement.style.border = 'none';
        ratioElement.style.outline = 'none';
        ratioElement.style.backgroundColor = 'transparent';
    }
    addSyncEvent(checkboxCell);
    
}
//一括選択・解除
function allCheck() {
    let allButton = document.getElementById('allButton');
    allButton.innerHTML = (allButton.className=='allClear') ? '<small>全編集</small>' : '<small>全解除</small>';
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
        setVisualEvent(checkbox);
    })    
}

function setVisualEvent(checkbox) {
    let nameId = checkbox.id.replace('CheckBox', 'Name');
    let nameTd = document.getElementById(nameId);
    if (checkbox.checked) {
        nameTd.className = 'selected';
    }else if (nameId.className != 'selected'){
        nameTd.className = '';
    }
    // checkbox.addEventListener('change', function() {
    addSyncEvent(checkbox);  
    // })          
    const inputId = checkbox.id.replace('CheckBox', 'Payment');
    const ratioId = checkbox.id.replace('CheckBox', 'Ratio');
    
    const inputElement = document.getElementById(inputId);
    const ratioElement = document.getElementById(ratioId);
    if (checkbox.checked) {
        // チェックされた場合、入力欄を表示
        inputElement.removeAttribute('readonly', 'false');
        inputElement.style.border = '1px solid black';
        inputElement.style.backgroundColor = 'white';   
        // チェックされた場合、入力欄を表示
        ratioElement.removeAttribute('readonly', 'false');
        ratioElement.style.border = '1px solid black';
        ratioElement.style.backgroundColor = 'white';                
    } else {
        // チェックされていない場合、入力欄を非表示
        inputElement.setAttribute('readonly', 'true');
        inputElement.style.border = 'none';
        inputElement.style.outline = 'none';
        inputElement.style.backgroundColor = 'transparent';
        ratioElement.setAttribute('readonly', 'true');
        ratioElement.style.border = 'none';
        ratioElement.style.outline = 'none';
        ratioElement.style.backgroundColor = 'transparent';
    }
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
// memberList = ["s","d","w","3"]
// groupName = "sss"

// データベースから情報を取得
get_(groupRef)
    .then((snapshot) => {
        let data = snapshot.val();
        groupName = data["groupName"];
        console.log("groupname:" + groupName);
        memberList = data["groupMember"];
        console.log("historyId:" + historyId);

        if (historyId != null){
            let groupInfo = data["history"][historyId][0];
            totalAmount = groupInfo["amount"];
            content = groupInfo["content"] ?? "";
            creditor = groupInfo["creditor"] ?? "";
            resultDict = groupInfo["resultDict"] ?? {};
            console.log("getResult:"+resultDict);
            roundUnit = groupInfo["roundUnit"] ?? 0;
            option = groupInfo["option"] ?? "ceil"
            fixedList = groupInfo["fixedMember"] ?? [];
            fracList = groupInfo["fracMember"] ?? [];
            ratioDict = groupInfo["ratio"] ?? {};  
            const remove = document.getElementById("remove");
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
    })
    .then(()=>{
        console.log("start");
        // 画面生成
        viewBuilder();

        let select = document.querySelector('[name="member"]')
        select.onchange = event => {
            let payer = document.getElementById('payer').value;
            for(let member of memberList){
                let memberRow = document.getElementById(member + 'Row');
                memberRow.className = "debtorRow";
                let fracToggle = document.getElementById(member + 'FracToggle');
                fracToggle.checked = false;

            }
            let payerRow = document.getElementById(payer + 'Row');
            payerRow.className = 'payerRow';
            let fracToggle = document.getElementById(payer + 'FracToggle');
            fracToggle.checked = true;
        }

        //同時編集のイベント通知を設定
        // 同期するチェックボックスの要素を取得
        var checkboxes = document.querySelectorAll('input[class="checkbox"]');
        // 各チェックボックスに対してイベントリスナーを追加
        checkboxes.forEach(function(checkbox) {
            checkbox.addEventListener('change', function() {
                setVisualEvent(checkbox);
                allButton.innerHTML = (!checkbox.checked) ? '<small>全編集</small>' : '<small>全解除</small>';
                allButton.className = (!checkbox.checked) ? "allButton": "allClear";
                
            });
        });

        // トグルによる表示・非表示の切り替え
        const toggleButton = document.getElementById('toggleButton')
        toggleButton.addEventListener('click', function() {
            var content = document.getElementById('toggleContent');
            if (content.style.display === 'none') {
                content.style.display = 'block';
                toggleButton.textContent = "閉じる";
            } else {
                content.style.display = 'none';
                toggleButton.textContent = "端数の分け方";
            }
            changeHeight();
        });
        // const toggleButton2 = document.getElementById('toggleButton2');
        // toggleButton2.addEventListener('click', function() {
        //     var content = document.getElementById('toggleContent2');
        //     if (content.style.display === 'none') {
        //         content.style.display = 'block';
        //         toggleButton2.textContent = "閉じる";
        //     } else {
        //         content.style.display = 'none';
        //         toggleButton2.textContent = "メンバー";
        //     }
        //     changeHeight();
        // });

    })
    .catch((error) => {
        console.log("ID:" + groupId);
        console.error("データの読み取りに失敗しました", error);
    });

    // // ページが完全に読み込まれた後に実行
    // document.addEventListener("DOMContentLoaded", function () {
    //     // Shepherd.jsのインスタンスを作成
    //     var tour = new Shepherd.Tour({
    //         defaultStepOptions: {
    //             classes: 'shepherd-theme-arrows',
    //             scrollTo: true,
    //         },
    //         useModalOverlay: true,
    //     });
        
    //     tour.addStep({
    //         id: 'step1',
    //         text: 'This is a step!',
    //         attachTo: {
    //             element: '.example-class',
    //             on: 'bottom',
    //         },
    //         modifiers: [
    //             {
    //                 name: 'keepTogether',
    //                 options: {
    //                     glued: true,
    //                 },
    //             },
    //             {
    //                 name: 'arrow',
    //                 options: {
    //                     element: '.example-class',
    //                 },
    //             },
    //         ],
    //     });        
    // });
  







// note//
// TODO: 金額固定と端数調整が共存しないようにする


document.getElementById('contact').addEventListener('click', function() {
    scrollToBottom();
});

// スクロールが滑らかに動くようにする関数
function scrollToBottom() {
    const startPosition = window.scrollY;
    const targetPosition = document.body.scrollHeight - window.innerHeight;
    const distance = targetPosition - startPosition;
    const duration = 1000; // アニメーションの時間（ミリ秒）

    let startTime;

    function scrollAnimation(currentTime) {
        if (startTime === undefined) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));

        if (timeElapsed < duration) {
            requestAnimationFrame(scrollAnimation);
        }
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t ** 3 : 1 - ((-2 * t + 2) ** 3) / 2;
    }

    requestAnimationFrame(scrollAnimation);
}