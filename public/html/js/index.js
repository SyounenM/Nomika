// スクロールイベントを監視
window.addEventListener('scroll', function() {
    // 要素の位置を取得
    var element = document.querySelector('.fade-in');
    var position = element.getBoundingClientRect();

    // 画面に表示されたらfade-inクラスを追加
    if (position.top >= 0 && position.bottom <= window.innerHeight) {
    element.classList.add('fade-in');
    }
});

changeFooter();

function changeFooter(){
    const footer = document.getElementById("footer");
    console.log("footer", footer.offsetWidth);
    var viewportWidth = window.innerWidth;
    footer.style.width = viewportWidth + 10 + "px";
    console.log("footer", footer.offsetWidth);
}

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