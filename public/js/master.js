
window.onload = function() {
    // Webページの横幅を取得
    var pageWidth = window.parent.screen.width;
    console.log(1);
    // 画面の横幅をWebページの横幅に合わせる
    document.documentElement.style.width = pageWidth + 'px';
    document.body.style.width = pageWidth + 'px';              
};


