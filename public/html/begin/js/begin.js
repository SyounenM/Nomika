import { app, database, ref_, set_, get_, update_, push_}  from "../../../js/master.js";
const createButton = document.getElementById("createButton");
const inputName = document.getElementById("inputName");
const inputGroup = document.getElementById("groupNameInput");
const inputMember = document.getElementById("inputMember");
const labelName = document.getElementById("labelName");
const labelGroup = document.getElementById("labelGroup");
const labelMember = document.getElementById("labelMember");
const addButton = document.getElementById("addButton");
let memberDiv = document.getElementById('memberList');
let member;

inputName.addEventListener("input", function() {
    if (inputName.value !== "") {
        labelName.innerHTML = "";
    } else {
        labelName.innerHTML = "<h5>お名前</h5>";
    }
});
inputGroup.addEventListener("input", function() {
    if (inputGroup.value !== "") {
        labelGroup.innerHTML = "";
    } else {
        labelGroup.innerHTML = "<h5>グループ名</h5>";
    }
});
inputMember.addEventListener("input", function() {
    if (inputMember.value !== "") {
        labelMember.innerHTML = "";
    } else {
        labelMember.innerHTML = "<h5>メンバー名</h5>";
    }
});

// member
addButton.addEventListener("click", function() {
    member = inputMember.value;
    let memberSpan = document.createElement("span");  //tdに何か追加。
    memberSpan.type = 'text';
    memberSpan.textContent =  ''+ member + '' ;
    memberSpan.style = 'height: 30px; background-color:white; margin-right:10px; border: solid 1px black; border-width: 2px; border-radius: 10px; padding: 5px;';
    memberSpan.id = member + "Span";

    let cancelButton = document.createElement('button');
    cancelButton.textContent = "×";
    cancelButton.id = member + 'Cancel';
    cancelButton.style = 'font-size: 15px; position: relative; top: -3px; width: 30px; background-color:white; border: solid 1px black; border-width: 2px; border-radius: 10px; padding: 5px; margin-left: 10px;';
    // cancelButton.style.height = '15px';
    // cancelButton.style.width = '15px';
    // cancelButton.style.offset

    cancelButton.onclick = function(){
        cancelMember(member);
    };

    memberSpan.appendChild(cancelButton)
    memberDiv.appendChild(memberSpan); 
});





function createGroup() {
    const groupName = document.getElementById('groupNameInput').value;
    const newGroupRef = push_(ref_(database, 'groups'));
    const groupId = newGroupRef.key;
    set_(newGroupRef, {
        groupName: groupName
    })
    .then(()=>{
        console.log("データが正常に書き込まれました");
        const groupURL = window.location.href + 'group.html?id=' + groupId;
        alert('グループが作成されました。\nURL: ' + groupURL);
        // createButton.href = `./group/group.html?id=${newGroupRef.key}`;
        // 新しいURLに遷移する
        window.location.href = `./group/group.html?id=${newGroupRef.key}`;

    })
    .catch((error)=>{
        console.error("データの書き込みに失敗しました", error);
    })



}

createButton.onclick = createGroup;

