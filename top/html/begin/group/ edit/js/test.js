let groupName = "ランチ"
let memberList = ["秀島", "川崎", "佐々木", "福田", "松島"];
let memberTable = document.getElementById('memberTable');
let tr = document.createElement("tr");

function viewBuilder() {
    let groupNameBox = document.getElementById('groupNameBox');
    groupNameBox.value = groupName; 
    for (let i=0 ; i<memberList.length; i++) {
        createMember(memberList[i]);
    }
    //完成したtrをtableに追加
    memberTable.appendChild(tr);  
}


function addMember() {
    let newMember = document.getElementById('newMember').value;
    memberList.push(newMember);
    createMember(newMember);
    console.log(memberList);
}


function createMember(member) {
    // メンバー名
    let nameTd = document.createElement("td");      //新しいtd要素を作って変数tdに格納
    let nameLabel = document.createElement("label");  //tdに何か追加。
    nameLabel.type = 'text';
    nameLabel.textContent =  member;
    nameLabel.id = 'memberName' + member;
    
    let cancelButton = document.createElement('button');
    cancelButton.textContent = "×";
    cancelButton.id = 'cancel' + member;
    cancelButton.onclick = function(){
        cancelMember(member);
    };

    nameLabel.appendChild(cancelButton)
    // nameTd.innerHTML = '<button onclick="cancelMember(this)">Delete</button>'
    nameTd.appendChild(nameLabel);        //tdにinpを追加

    tr.appendChild(nameTd);  
}

function cancelMember(member) {
    console.log(memberList);
    let colIndex = memberList.indexOf(member);
    memberList.splice(colIndex, 1);
    console.log(memberList);
    // var table = document.getElementById("memberTable");
    // // Loop through each row and remove the cell in the specified column
    // for (var i = 0; i < table.rows.length; i++) {
    tr.deleteCell(colIndex);
    // }
}

viewBuilder();