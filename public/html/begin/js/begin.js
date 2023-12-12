import { app, database, ref_, set_, get_, update_, push_}  from "../../../js/master.js";
const createButton = document.getElementById("createButton");

function createGroup() {
    const groupName = document.getElementById('groupNameInput').value;
    const newGroupRef = push_(ref_(database, 'groups'));
    const groupId = newGroupRef.key;
    update_(newGroupRef, {
        groupName: groupName
    })
    .then(()=>{
        console.log("データが正常に書き込まれました");

        const groupURL = window.location.href + 'group.html?id=' + groupId;
        alert('グループが作成されました。\nURL: ' + groupURL);
        createButton.href = `./group/group.html?id=${newGroupRef.key}`;
    })
    .catch((error)=>{
        console.error("データの書き込みに失敗しました", error);
    })

}

createButton.onclick = createGroup;

