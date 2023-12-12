const groupId = new URLSearchParams(window.location.search).get('id');
const logo = document.getElementById("logo");
const home = document.getElementById("home");
const back = document.getElementById("back");
logo.href = `../../group.html?id=${groupId}`;
home.href = `../../group.html?id=${groupId}`;
back.href = `../game.html?id=${groupId}`;





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

function getRandomInt(min, max) {
  return min+Math.floor(Math.random() * Math.floor(max-min));
}

function preload(){
    
}

function setup(){
    var canvas = createCanvas(600,400);
    canvas.parent('canvas');
    textSize(20);
    // stroke(0,0,0);
    // fill(0,0,0);
    background(255,255,255,0);
    recalculate();
    dataFetch();
}

function mousePressed(){
    holding = true;
    
}

function mouseReleased() {
    holding = false;

}

function touchStarted(){
    mousePressed();
}

function touchEnded(){
    mouseReleased();
}

//set color indicator
function cssColorSet(){
    var counter = 0;
    $('.color-indicator').each(function(){
        push();
        colorMode(HSL, 255);
        var c = color(colorList[counter],255-COLOR_ADJ*colorList[counter],Lightness);
        pop();
        $(this).css('background-color', "rgb("+c._getRed()+","+c._getGreen()+","+c._getBlue()+")");
        counter++;
    });
}

//input to array
function dataFetch(){
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

function validation(){
    var badflag = false;
    $('.name').each(function(){
        if($(this).val()==""){
            badflag = true;
        }
    });
    $('.ratio').each(function(){
        if(!($(this).val()>0)){
            badflag = true;
        }
    });
    if(badflag){
        alert('項目名と割合を正しく設定してください。');
        return 1;
    }
    return 0;
}

function start(){
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

function stop(){
    if(//mode==Mode.acceleration || 
       mode==Mode.constant){
        $('#start').css('display', 'none');
        $('#stop').css('display', 'none');
        mode = Mode.deceleration;
    }
}

function reset(){
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

function drawRoulette(){
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

function draw(){
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
        }
        break;
    }
    drawRoulette();
}