import { app, database, ref_, set_, get_, update_, push_, goOffline_}  from "../../../../../../js/master.js";
console.log("start");
// // アプリケーションが閉じられたときに呼ばれる処理
// window.onbeforeunload = function () {
//     // Firebase Realtime Databaseへの接続を切断
//     goOffline_(database);
// };



const groupId = new URLSearchParams(window.location.search).get('id');
const logo = document.getElementById("logo");
const topButton = document.getElementById("top");
const home = document.getElementById("home");
const backButton = document.getElementById("back");
logo.href = `../../group.html?id=${groupId}`;
function showAlert() {
    var result = confirm('注意 グループから抜けることになります');
    if (result){
        topButton.href = `../../../../../index.html`;
    }
}
topButton.onclick = showAlert;
home.href = `../../group.html?id=${groupId}`;
backButton.href = `../game.html?id=${groupId}`;

let groupRef = ref_(database,'groups/' + groupId);
// データベースから名前を取得
get_(groupRef)
    .then((snapshot) => {
    let data = snapshot.val();
    let memberList = data["groupMember"];
    console.log("memberList:" + memberList);
})
    .catch((error) => {
    console.log("ID:" + groupId);
    console.error("データの読み取りに失敗しました", error);
});

// // JavaScriptのリストの値（仮の例）
// const initialData = [
//     { color: '#FF0000', name: 'A', ratio: 1 },
//     { color: '#00FF00', name: 'B', ratio: 2 },
//     // 他のデータ...
// ];

// // リストからテーブルを動的に生成する関数
// function generateTable(data) {
//     const tableBody = document.getElementById('tableBody'); // テーブルのtbody要素のIDを取得する必要があります

//     data.forEach(item => {
//         const newRow = document.createElement('tr');
//         newRow.classList.add('item');

//         const colorIndicatorCell = document.createElement('td');
//         const colorDiv = document.createElement('div');
//         colorDiv.classList.add('color-indicator');
//         colorDiv.style.backgroundColor = item.color;
//         colorIndicatorCell.appendChild(colorDiv);

//         const nameCell = document.createElement('td');
//         const nameInput = document.createElement('input');
//         nameInput.type = 'text';
//         nameInput.classList.add('name', 'input-content');
//         nameInput.value = item.name;
//         nameCell.appendChild(nameInput);

//         const ratioCell = document.createElement('td');
//         const ratioInput = document.createElement('input');
//         ratioInput.type = 'number';
//         ratioInput.classList.add('ratio', 'input-ratio');
//         ratioInput.value = item.ratio;
//         ratioInput.min = 1;
//         ratioCell.appendChild(ratioInput);

//         const deleteButtonCell = document.createElement('td');
//         const deleteButton = document.createElement('button');
//         deleteButton.type = 'button';
//         deleteButton.classList.add('deleteButton');
//         deleteButton.textContent = '削除';
//         deleteButton.onclick = function() {
//             rmItem(this);
//         };
//         deleteButtonCell.appendChild(deleteButton);

//         newRow.appendChild(colorIndicatorCell);
//         newRow.appendChild(nameCell);
//         newRow.appendChild(ratioCell);
//         newRow.appendChild(deleteButtonCell);

//         tableBody.appendChild(newRow);
//     });
// }

// // テーブル生成関数を呼び出して初期データを適用
// generateTable(initialData);


// // ページの読み込み後にテーブルを生成
// document.addEventListener('DOMContentLoaded', function() {
//     generateTable(initialData);
// });


// ルーレット1
// const startButton = document.getElementById('start-button');
// const rouletteItems = document.getElementById('roulette-items');
// let isSpinning = false;
// let spinDuration;

// startButton.addEventListener('click', () => {
//   if (isSpinning) return;

//   isSpinning = true;
//   spinDuration = Math.random() * 3000 + 3000; // 3秒から6秒の間でランダムに回転時間を設定

//   rouletteItems.style.transition = `top ${spinDuration}ms cubic-bezier(.1, .1, .1, 1)`;
//   rouletteItems.style.top = `-${rouletteItems.offsetHeight}px`;

//   setTimeout(() => {
//     isSpinning = false;
//     rouletteItems.style.transition = '';
//     rouletteItems.style.top = '0px';

//     // 結果表示処理
//     const selectedItemIndex = Math.floor(Math.random() * rouletteItems.children.length);
//     const selectedItem = rouletteItems.children[selectedItemIndex];
//     alert(`結果は${selectedItem.textContent}です！`);
//   }, spinDuration);
// });


// ルーレット2
var Mode = {
    waiting: 0,
    acceleration: 1,
    constant: 2,
    deceleration: 3,
    result: 4
};
var mode = Mode.waiting;
var nameList = [];
var probabilityList = [];
var colorList = [];
var ratioSum = 0;
var speed = 0.0;
var theta = 0.0;
var len = 0;
var resultDisplayed = false;

const ACCEL = 0.01;
const DECEL = 0.01;
const MAX_SPEED = 1.0;
const RADIUS = 125;
const COLOR_ADJ = 0.8;
const TRIANGLE_SIZE = 10;
const MARGIN = 10;
const DECEL_RAND_LEVEL = 10;
const DECEL_RAND_MAGNITUDE = 0.001;
const Lightness = 170;

var holding = false;

// function getRandomInt(min, max) {
//   return min+Math.floor(Math.random() * Math.floor(max-min));
// }
window.getRandomInt=(min, max)=> {
    return min+Math.floor(Math.random() * Math.floor(max-min));
  }

// function preload(){
    
// }
window.preload=()=>{
    
}

// function setup(){
//     console.log("setup");
//     var canvas = createCanvas(600,400);
//     canvas.parent('canvas');
//     textSize(20);
//     // stroke(0,0,0);
//     // fill(0,0,0);
//     background(255,255,255,0);
//     recalculate();
//     dataFetch();
// }
window.setup=()=>{
    console.log("setup");
    var canvas = createCanvas(600,400);
    canvas.parent('canvas');
    textSize(20);
    // stroke(0,0,0);
    // fill(0,0,0);
    background(255,255,255,0);
    recalculate();
    dataFetch();
}

// function mousePressed(){
//     holding = true;
    
// }
window.mousePressed=()=>{
    holding = true;
    
}

// function mouseReleased() {
//     holding = false;

// }
window.mouseReleased=()=>{
    holding = false;

}

// function touchStarted(){
//     mousePressed();
// }
window.touchStarted=()=>{
    mousePressed();
}

// function touchEnded(){
//     mouseReleased();
// }
window.touchEnded=()=>{
    mouseReleased();
}

//set color indicator
// function cssColorSet(){
//     console.log("cssColorSet");
//     var counter = 0;
//     $('.color-indicator').each(function(){
//         push();
//         colorMode(HSL, 255);
//         var c = color(colorList[counter],255-COLOR_ADJ*colorList[counter],Lightness);
//         pop();
//         console.log("popped1")
//         $(this).css('background-color', "rgb("+c._getRed()+","+c._getGreen()+","+c._getBlue()+")");
//         counter++;
//     });
// }
window.cssColorSet=()=>{
    console.log("cssColorSet");
    var counter = 0;
    $('.color-indicator').each(function(){
        push();
        colorMode(HSL, 255);
        var c = color(colorList[counter],255-COLOR_ADJ*colorList[counter],Lightness);
        pop();
        console.log("popped1")
        $(this).css('background-color', "rgb("+c._getRed()+","+c._getGreen()+","+c._getBlue()+")");
        counter++;
    });
}

//input to array
// function dataFetch(){
//     console.log("dataFetch");
//     ratioSum = 0.0;
//     $('.item').each(function(){
//         var ratio = $(this).find('.ratio').val()-0;
//         ratioSum += ratio;
//     });
//     nameList = [];
//     probabilityList = [];
//     $('.item').each(function(){
//         var name = $(this).find('.name').val();
//         var ratio = $(this).find('.ratio').val()-0;
//         nameList.push(name);
//         probabilityList.push(ratio/ratioSum);
//     });
//     //color
//     var colors = [];
//     len = nameList.length;
//     for(var i=0;i<len;i++){
//         colors.push(Math.floor(255/len*i));
//     }
//     colorList = [];
//     if(len%2==0){
//         for(var i=0;i<len;i+=2){
//             colorList[i] = colors[Math.floor(i/2)];
//         }
//         for(var i=1;i<len;i+=2){
//             colorList[i] = colors[Math.floor(i/2 + len/2)];
//         }
//     }else{
//         for(var i=0;i<len;i+=2){
//             colorList[i] = colors[Math.floor(i/2)];
//         }
//         for(var i=1;i<len;i+=2){
//             colorList[i] = colors[Math.floor(i/2)+Math.floor(len/2)+1];
//         }
//     }
//     cssColorSet();
// }
window.dataFetch=()=>{
    console.log("dataFetch");
    ratioSum = 0.0;
    $('.item').each(function(){
        var ratio = $(this).find('.ratio').val()-0;
        ratioSum += ratio;
    });
    nameList = [];
    probabilityList = [];
    $('.item').each(function(){
        var name = $(this).find('.name').val();
        var ratio = $(this).find('.ratio').val()-0;
        nameList.push(name);
        probabilityList.push(ratio/ratioSum);
    });
    //color
    var colors = [];
    len = nameList.length;
    for(var i=0;i<len;i++){
        colors.push(Math.floor(255/len*i));
    }
    colorList = [];
    if(len%2==0){
        for(var i=0;i<len;i+=2){
            colorList[i] = colors[Math.floor(i/2)];
        }
        for(var i=1;i<len;i+=2){
            colorList[i] = colors[Math.floor(i/2 + len/2)];
        }
    }else{
        for(var i=0;i<len;i+=2){
            colorList[i] = colors[Math.floor(i/2)];
        }
        for(var i=1;i<len;i+=2){
            colorList[i] = colors[Math.floor(i/2)+Math.floor(len/2)+1];
        }
    }
    cssColorSet();
}

// function validation(){
//     var badflag = false;
//     $('.name').each(function(){
//         if($(this).val()==""){
//             badflag = true;
//         }
//     });
//     // $('.ratio').each(function(){
//     //     if(!($(this).val()>0)){
//     //         badflag = true;
//     //     }
//     // });
//     if(badflag){
//         alert('項目名を正しく設定してください。');
//         return 1;
//     }
//     return 0;
// }
window.validation=()=>{
    var badflag = false;
    $('.name').each(function(){
        if($(this).val()==""){
            badflag = true;
        }
    });
    // $('.ratio').each(function(){
    //     if(!($(this).val()>0)){
    //         badflag = true;
    //     }
    // });
    if(badflag){
        alert('項目名を正しく設定してください。');
        return 1;
    }
    return 0;
}


// function start(){
//     if(mode==Mode.waiting){
//         if(validation()==1){
//             return;
//         }
//         $('#stop').css('display', 'inline-block');
//         $('#start').css('display', 'none');
//         dataFetch();
//         mode = Mode.acceleration;
//     }
// }
window.start=()=>{
    if(mode==Mode.waiting){
        if(validation()==1){
            return;
        }
        $('#stop').css('display', 'inline-block');
        $('#start').css('display', 'none');
        dataFetch();
        mode = Mode.acceleration;
    }
}

// function stop(){
//     if(//mode==Mode.acceleration || 
//        mode==Mode.constant){
//         $('#start').css('display', 'none');
//         $('#stop').css('display', 'none');
//         mode = Mode.deceleration;
//     }
// }
window.stop=()=>{
    if(//mode==Mode.acceleration || 
       mode==Mode.constant){
        $('#start').css('display', 'none');
        $('#stop').css('display', 'none');
        mode = Mode.deceleration;
    }
}

// function reset(){
//     $('#start').css('display', 'inline-block');
//     $('#stop').css('display', 'none');
//     theta = 0.0;
//     speed = 0.0;
//     mode = Mode.waiting;
//     if(validation()==0){
//         dataFetch();
//     }
//     $('#result').html('????');
//     resultDisplayed = false;
// }
window.reset=()=>{
    $('#start').css('display', 'inline-block');
    $('#stop').css('display', 'none');
    theta = 0.0;
    speed = 0.0;
    mode = Mode.waiting;
    if(validation()==0){
        dataFetch();
    }
    $('#result').html('????');
    resultDisplayed = false;
}

// function drawRoulette(){
//     var angleSum = 0.0;
//     push();
//     colorMode(HSL, 255);
//     for(var i=0;i<len;i++){
//         fill(colorList[i],255-COLOR_ADJ*colorList[i],Lightness);
//         arc(0,0,RADIUS*2,RADIUS*2,angleSum,angleSum+2*PI*probabilityList[i]);
//         angleSum += probabilityList[i]*2*PI;
//     }
//     pop();
//     console.log("popped2")
// }
window.drawRoulette=()=>{
    var angleSum = 0.0;
    push();
    colorMode(HSL, 255);
    for(var i=0;i<len;i++){
        fill(colorList[i],255-COLOR_ADJ*colorList[i],Lightness);
        arc(0,0,RADIUS*2,RADIUS*2,angleSum,angleSum+2*PI*probabilityList[i]);
        angleSum += probabilityList[i]*2*PI;
    }
    pop();
    console.log(memberList);
}

// function draw(){
//     fill(255,255,255,0);
//     // rect(0,0,width,height);
//     translate(width/2, height/2);

//     fill(255,0,0);
//     push();
//     translate(0, -RADIUS-MARGIN);
//     triangle(0, 0, -TRIANGLE_SIZE/2, -TRIANGLE_SIZE, TRIANGLE_SIZE/2, -TRIANGLE_SIZE);
//     pop();

//     switch(mode){
//     case Mode.waiting:
//         $('.RouletteSetup').removeClass('unselectable');
//         $('#result').html("&nbsp;");
//         break;
//     case Mode.acceleration:
//         if(speed<MAX_SPEED){
//             speed += ACCEL;
//         }else{
//             mode = Mode.constant;
//             speed = MAX_SPEED;
//         }
//         theta += speed;
//         theta-=(Math.floor(theta/2/PI))*2*PI;
//         rotate(theta);
//         break;
//     case Mode.constant:
//         theta += speed;
//         theta-=(Math.floor(theta/2/PI))*2*PI;
//         rotate(theta);
//         break;
//     case Mode.deceleration:
//         if(speed>DECEL){
//             speed -= DECEL+getRandomInt(-DECEL_RAND_LEVEL,DECEL_RAND_LEVEL)*DECEL_RAND_MAGNITUDE;
//         }else{
//             speed = 0.0;
//             mode = Mode.result;
//         }
//         theta += speed;
//         theta-=(Math.floor(theta/2/PI))*2*PI;
//         rotate(theta);
//         break;
//     case Mode.result:
//         rotate(theta);
//         if(!resultDisplayed){
//             resultDisplayed = true;
//             var angleSum = theta;
//             var beforeAngleSum = theta;
//             var result = 0;
//             for(var i=0;i<len;i++){
//                 angleSum += probabilityList[i]*2*PI;
//                 if((angleSum>3/2*PI&&beforeAngleSum<3/2*PI) || (angleSum>7/2*PI&&beforeAngleSum<7/2*PI)){
//                     result = i;
//                     break;
//                 }
//                 beforeAngleSum = angleSum;
//             }
//             $('#result').html(nameList[result]);
//             $('.RouletteSetup').addClass('unselectable');
//         }
//         break;
//     }
//     drawRoulette();
// }
window.draw=()=>{
    fill(255,255,255,0);
    // rect(0,0,width,height);
    translate(width/2, height/2);

    fill(255,0,0);
    push();
    translate(0, -RADIUS-MARGIN);
    triangle(0, 0, -TRIANGLE_SIZE/2, -TRIANGLE_SIZE, TRIANGLE_SIZE/2, -TRIANGLE_SIZE);
    pop();

    switch(mode){
    case Mode.waiting:
        $('.RouletteSetup').removeClass('unselectable');
        $('#result').html("&nbsp;");
        break;
    case Mode.acceleration:
        if(speed<MAX_SPEED){
            speed += ACCEL;
        }else{
            mode = Mode.constant;
            speed = MAX_SPEED;
        }
        theta += speed;
        theta-=(Math.floor(theta/2/PI))*2*PI;
        rotate(theta);
        break;
    case Mode.constant:
        theta += speed;
        theta-=(Math.floor(theta/2/PI))*2*PI;
        rotate(theta);
        break;
    case Mode.deceleration:
        if(speed>DECEL){
            speed -= DECEL+getRandomInt(-DECEL_RAND_LEVEL,DECEL_RAND_LEVEL)*DECEL_RAND_MAGNITUDE;
        }else{
            speed = 0.0;
            mode = Mode.result;
        }
        theta += speed;
        theta-=(Math.floor(theta/2/PI))*2*PI;
        rotate(theta);
        break;
    case Mode.result:
        rotate(theta);
        if(!resultDisplayed){
            resultDisplayed = true;
            var angleSum = theta;
            var beforeAngleSum = theta;
            var result = 0;
            for(var i=0;i<len;i++){
                angleSum += probabilityList[i]*2*PI;
                if((angleSum>3/2*PI&&beforeAngleSum<3/2*PI) || (angleSum>7/2*PI&&beforeAngleSum<7/2*PI)){
                    result = i;
                    break;
                }
                beforeAngleSum = angleSum;
            }
            $('#result').html(nameList[result]);
            $('.RouletteSetup').addClass('unselectable');
        }
        break;
    }
    drawRoulette();
}


// function recalculate(){
//     var ratioSumJs = 0;
//     $('.ratio').each(function(){
//         ratioSumJs += $(this).val()-0; //文字から数字の変換
//     });
//     $(".item").each(function(){
//         var probability = ($(this).find(".ratio").first().val()-0) / ratioSumJs;
//         probability*=100;
//         probability = probability.toFixed(3);
//         $(this).children(".probability").first().html(probability+"%");
//     });
// }
window.recalculate=()=>{
    var ratioSumJs = 0;
    $('.ratio').each(function(){
        ratioSumJs += $(this).val()-0; //文字から数字の変換
    });
    $(".item").each(function(){
        var probability = ($(this).find(".ratio").first().val()-0) / ratioSumJs;
        probability*=100;
        probability = probability.toFixed(3);
        $(this).children(".probability").first().html(probability+"%");
    });
}
$('.add').click(function(){
    var add = '<tr class="item"><td><div class="color-indicator" style="background-color:#000000;"></div></td><td><input type="text" class="name input-content" value="項目"></td><td><input type="number" class="ratio  input-ratio" value="1" min="1"></td><td><button class="deleteButton" type="button" onclick="rmItem(this)">削除</button></td></tr>';
    
    recalculate();
    if(mode==Mode.waiting){
        $('#table').append(add);
        dataFetch();
    }
});
// function rmItem(e){
//     if(mode==Mode.waiting){
//         if($('.ratio').length>2){
//             $(e).parent().parent().remove();
//             recalculate();
//             dataFetch();
//         }          
//     }
// }
window.rmItem=(e)=>{
    if(mode==Mode.waiting){
        if($('.ratio').length>2){
            $(e).parent().parent().remove();
            recalculate();
            dataFetch();
        }          
    }
}
$('#table').on('change', '.ratio', function(){
    recalculate();
    if(mode==Mode.waiting){
        dataFetch();
    }
});