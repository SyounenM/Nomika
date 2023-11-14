const memberList = ["秀島", "川崎", "佐々木", "福田", "松島"];

function addMember() {
    var resultDiv = document.getElementById('result');
    for (member of memberList) {
        var nameDiv = document.createElement('div');
        nameDiv.textContent = member;
        nameDiv.id = 'memberName' + member;
        resultDiv.appendChild(nameDiv);

        var ratioLabel = document.createElement('label');
        ratioLabel.textContent = '傾斜の比率:';
        nameDiv.appendChild(ratioLabel);

        var ratioInput = document.createElement('input');
        ratioInput.type = 'number';
        ratioInput.id = 'memberRatio' + member;
        ratioInput.min = '0';
        ratioInput.max = '100';
        ratioInput.step = '1';
        nameDiv.appendChild(ratioInput);

        var memberResult = document.createElement('div');
        memberResult.id = 'memberResult' + member;
        nameDiv.appendChild(memberResult)
    }
}

function calculate() {
    var memberCount = memberList.length;
    var totalAmount = parseFloat(document.getElementById('amount').value);

    // 参加者の名前と割合を取得
    var membersRatio = [];
    for (member of memberList) {
        var name = document.getElementById('memberName' + member).value;
        var ratio = parseFloat(document.getElementById('memberRatio' + member).value);
        membersRatio.push({ name: name, ratio: ratio });
    }

    // 各参加者ごとの支払い金額を計算
    var totalRatio = membersRatio.reduce((sum, member) => sum + member.ratio, 0);

    for (var i = 0; i < memberCount; i++) {
        var amountPerPerson = (totalAmount * membersRatio[i].ratio) / totalRatio;
        resultText += "¥" + amountPerPerson.toFixed(2);
        document.getElementById('memberResult' + memberList[i]).innerHTML = resultText;

    }

}

// // 参加者の数が変更されたときに入力フィールドを更新
// document.getElementById('membersRatio').addEventListener('input', addMember);

// 初回にも一度呼び出す
addMember();
