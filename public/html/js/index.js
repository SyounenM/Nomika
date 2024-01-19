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
