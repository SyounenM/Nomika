let groupName = "ランチ"
let memberList = ["秀島", "川崎", "佐々木", "福田", "松島"];
let memberTable = document.getElementById('memberTable');
let memberListDiv = document.getElementById('memberList')

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
    let memberSpan = document.createElement("span");  //tdに何か追加。
    memberSpan.type = 'text';
    memberSpan.textContent =  ''+ member + '' ;
    memberSpan.style = 'background-color:#BBBB; margin-right:10px; border: solid 1px #BBB; border-width: 2px; border-radius: 10px;';
    memberSpan.id = member + "Span";

    let cancelButton = document.createElement('button');
    cancelButton.textContent = "×";
    cancelButton.id = member + 'Cancel';
    cancelButton.style = 'background-color:#BBBBB; border: solid 1px #BBBBB; border-width: 2px; border-radius: 10px;';

    cancelButton.onclick = function(){
        cancelMember(member);
    };

    memberSpan.appendChild(cancelButton)
    memberListDiv.appendChild(memberSpan);  
}

function cancelMember(member) {
    console.log(memberList);
    let colIndex = memberList.indexOf(member);
    memberList.splice(colIndex, 1);
    console.log(memberList);
    let target = document.getElementById(member + "Span");
    target.remove();
}

function update(params) {
    
}

function cancel(params) {
    
}

viewBuilder();