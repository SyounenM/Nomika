import {database, ref_, set_, get_, update_, push_, goOffline_}  from "../../../../../../js/master.js";
console.log("start");
// // アプリケーションが閉じられたときに呼ばれる処理
window.onbeforeunload = function () {
//     // Firebase Realtime Databaseへの接続を切断
    goOffline_(database);
};

const groupId = new URLSearchParams(window.location.search).get('id');
const icon = document.getElementById("icon");
const logo = document.getElementById("logo");
const topButton = document.getElementById("top");
const home = document.getElementById("home");
const backButton = document.getElementById("back");
icon.href = `../../group.html?id=${groupId}`;
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

// // 画面高さ
var backgroundRoulette = document.getElementById("background-roulette");
var backHeight;

// 高さの変更
function changeHeight() {
    var offsetTop = backButton.offsetTop;
    console.log(offsetTop);
    backHeight = offsetTop + 600;
    backgroundRoulette.style.height = backHeight + "px";
}
function changeFooter(){
    const footer = document.getElementById("footer");
    console.log("footer", footer.offsetWidth);
    var viewportWidth = window.innerWidth;
    footer.style.width = viewportWidth + 10 + "px";
    console.log("footer", footer.offsetWidth);
}

// ページの読み込み後にテーブルを生成
document.addEventListener('DOMContentLoaded', function() {
    // データベースから名前を取得
    let groupRef = ref_(database,'groups/' + groupId);
    get_(groupRef)
    .then((snapshot) => {
    let data = snapshot.val();
    let memberList = data["groupMember"];
    let initialData = [];
    for (let i = 0; i < memberList.length; i++) {
        initialData.push({ name: memberList[i], ratio: 1 });
    }
    generateTable(initialData);
    setup();
    draw();
    })
    .catch((error) => {
    console.log("ID:" + groupId);
    console.error("データの読み取りに失敗しました", error);
            // 別のURLにリダイレクト
    window.location.href = `../../../../500.html`;
    });
});

function generateTable(data) {
    const tableBody = document.getElementById('tableBody');

    data.forEach(item => {
        const newRow = document.createElement('tr');
        newRow.classList.add('item');

        const colorIndicatorCell = document.createElement('td');
        const colorDiv = document.createElement('div');
        colorDiv.classList.add('color-indicator');
        colorDiv.style.backgroundColor = item.color;
        colorIndicatorCell.appendChild(colorDiv);

        const nameCell = document.createElement('td');
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.classList.add('name', 'input-content');
        nameInput.value = item.name;
        nameCell.appendChild(nameInput);

        const ratioCell = document.createElement('td');
        const ratioInput = document.createElement('input');
        ratioInput.type = 'number';
        ratioInput.classList.add('ratio', 'input-ratio');
        ratioInput.value = item.ratio;
        ratioInput.min = 1;
        ratioCell.appendChild(ratioInput);

        const deleteButtonCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.classList.add('deleteButton');
        deleteButton.textContent = '削除';
        deleteButton.onclick = function() {
            rmItem(this);
        };
        deleteButtonCell.appendChild(deleteButton);

        newRow.appendChild(colorIndicatorCell);
        newRow.appendChild(nameCell);
        newRow.appendChild(ratioCell);
        newRow.appendChild(deleteButtonCell);

        tableBody.appendChild(newRow);
    });
}

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

// var holding = false;

window.getRandomInt=(min, max)=> {
    return min+Math.floor(Math.random() * Math.floor(max-min));
  }

window.preload=()=>{
    
}

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

window.cssColorSet=()=>{
    console.log("cssColorSet");
    var counter = 0;
    $('.color-indicator').each(function(){
        // push();
        colorMode(HSL, 255);
        var c = color(colorList[counter],255-COLOR_ADJ*colorList[counter],Lightness);
        pop();
        console.log("popped1")
        $(this).css('background-color', "rgb("+c._getRed()+","+c._getGreen()+","+c._getBlue()+")");
        $(this).css("border", "2px solid black")
        counter++;
    });
}

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
    changeHeight();
    changeFooter();
}

window.validation=()=>{
    var badflag = false;
    $('.name').each(function(){
        if($(this).val()==""){
            badflag = true;
        }
    });
    if(badflag){
        alert('項目名を正しく設定してください。');
        return 1;
    }
    return 0;
}

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

window.stop=()=>{
    if(//mode==Mode.acceleration || 
       mode==Mode.constant){
        $('#start').css('display', 'none');
        $('#stop').css('display', 'none');
        mode = Mode.deceleration;
    }
}

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
}

window.draw=()=>{
    fill(255,255,255,0);
    translate(width/2, height/2);

    // fill(255,0,0);
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
        $('.RouletteSetup').addClass('unselectable');
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
    fill(255,255,255);
    translate(0,0);
    circle(0,0,20)
}

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