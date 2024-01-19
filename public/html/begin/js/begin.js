import { app, database, ref_, set_, get_, update_, push_}  from "../../../js/master.js";
const createButton = document.getElementById("createButton");
// const inputName = document.getElementById("inputName");
const inputGroup = document.getElementById("groupNameInput");
const inputMember = document.getElementById("inputMember");
// const labelName = document.getElementById("labelName");
const labelGroup = document.getElementById("labelGroup");
const labelMember = document.getElementById("labelMember");
const addButton = document.getElementById("addButton");
let memberDiv = document.getElementById('memberList');
let memberList = [];


// 画面高さ
var background = document.getElementById("background-begin");
var backHeight = 0;
changeHeight();

// 高さの変更
function changeHeight() {
    var offsetTop = createButton.offsetTop;
    console.log(offsetTop);
    backHeight = offsetTop + 600;
    background.style.height = backHeight + "px";
}


// inputName.addEventListener("input", function() {
//     if (inputName.value !== "") {
//         labelName.innerHTML = "";
//     } else {
//         labelName.innerHTML = "<h5>お名前</h5>";
//     }
// });
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
    if (amountSelect.value >= 1 || amountSelect.value <= 99) {
        if (inputMember.value != "") {
            for (let i = 0; i < amountSelect.value; i++) {
                let member;
                if (amountSelect.value != 1){
                    if (i < 9){
                        member = inputMember.value + "__0" + (i + 1);
                    } else {
                        member = inputMember.value + "__" + (i + 1);
                    }
                }
                else{
                    member = inputMember.value;
                }
                if (i == amountSelect.value - 1){
                    inputMember.value = "";
                    amountSelect.value = 1;
                }
                for (let i = 0; i < member.length; i++) {
                    if (memberList[i] == member){
                        alert('既に追加されています。同名のメンバーは追加できません。');
                        return;
                    }
                }
                memberList.push(member);
                console.log(memberList);
                let memberSpan = document.createElement("span");
                memberSpan.type = 'text';
                memberSpan.textContent =  '' + member + '' ;
                memberSpan.style = 'font-size: 25px; height: 50px; background-color:white; margin-right:10px; border: solid 1px black; border-width: 2px; border-radius: 10px; padding: 7px;';
                memberSpan.id = member + "Span";

                let cancelButton = document.createElement('button');
                cancelButton.textContent = "×";
                cancelButton.id = member + 'Cancel';
                cancelButton.style = 'font-size: 15px; position: relative; top: -3px; width: 35px; background-color:white; border: solid 1px black; border-width: 2px; border-radius: 10px; padding: 5px; margin-left: 10px; color: black;';
                // cancelButton.style.height = '15px';
                // cancelButton.style.width = '15px';
                // cancelButton.style.offset

                cancelButton.onclick = function(event){
                    event.preventDefault();
                    cancelMember(member);
                };

                memberSpan.appendChild(cancelButton)
                memberDiv.appendChild(memberSpan); 
            }

            changeHeight();

        } else {
            alert('メンバー名を入力してください');
        }
    } else {
        alert('人数を1-99の数字で入力してください');
    }
});

//TODO:メンバーをキャンセルすると再読み込みする
function cancelMember(member) {
    let colIndex = memberList.indexOf(member);
    console.log(colIndex);
    memberList.splice(colIndex, 1);
    console.log(memberList);
    console.log(member);
    let target = document.getElementById(member + "Span");
    target.remove();
}

let flgAlredyCreated = false;
function createGroup() {
    if (flgAlredyCreated) {
        return;
    }
    flgAlredyCreated = true;
    if (memberList.length > 1) {
        const groupName = document.getElementById('groupNameInput').value;
        const newGroupRef = push_(ref_(database, 'groups'));
        const groupId = newGroupRef.key;
        set_(newGroupRef, {
            groupName: groupName,
            groupMember: memberList
        })
        .then(()=>{
            console.log("データが正常に書き込まれました");
            console.log(memberList);
            const groupURL = window.location.href + 'group.html?id=' + groupId;
            alert('グループが作成されました。\nURL: ' + groupURL);
            // createButton.href = `./group/group.html?id=${newGroupRef.key}`;
            // 新しいURLに遷移する
            window.location.href = `./group/group.html?id=${newGroupRef.key}`;

        })
        .catch((error)=>{
            console.error("データの書き込みに失敗しました", error);
        })
    } else {
        alert('二人以上メンバーを追加してください');
    }
}

createButton.onclick = createGroup;


let amountSelect = document.getElementById('amount');
amountSelect.min = '1';
amountSelect.max = '99';
