// 【設定】デフォルトの猫画像ファイル名
const DEFAULT_IMAGE_URL = 'cat.png'; 

const canvas = document.getElementById('preview-canvas');
const ctx = canvas.getContext('2d');
const textInput = document.getElementById('text-input');
const downloadBtn = document.getElementById('download-btn');
const resultWrap = document.getElementById('result-wrap');
const resultImg = document.getElementById('result-img');
const secretTrigger = document.getElementById('secret-trigger');
const adminUi = document.getElementById('admin-ui');
const imageInput = document.getElementById('image-input');
const resetBtn = document.getElementById('reset-btn');

const CANVAS_SIZE = 500;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

let backgroundImage = null;

// 1. 起動時にデフォルトの猫画像を読み込んで記憶する
const defaultImg = new Image();
defaultImg.onload = () => {
    backgroundImage = defaultImg; // 読み込めたら背景にセット
    draw();
};
defaultImg.onerror = () => {
    console.log("cat.png が見つかりません。画像なしで文字だけ描画します。");
    draw(); // 画像がなくても文字と背景だけは出す安全対策
};
defaultImg.src = DEFAULT_IMAGE_URL;

// タイトルを「連続5回タップ」した時だけ切り替える判定
let clickCount = 0;
let clickTimer = null;
secretTrigger.addEventListener('click', () => {
    clickCount++;
    clearTimeout(clickTimer);
    if (clickCount >= 5) {
        adminUi.classList.toggle('hidden');
        clickCount = 0; 
    } else {
        clickTimer = setTimeout(() => { clickCount = 0; }, 1000);
    }
});

// 管理モードで別の画像が選ばれたとき
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            backgroundImage = img; // 新しい画像に切り替え
            draw();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// ★【要望通り】クリアボタンを押したら、最初のデフォルトの猫にカチッとリセットする
resetBtn.addEventListener('click', () => {
    imageInput.value = '';        // ファイル選択を空にする
    backgroundImage = defaultImg; // 最初に記憶した猫画像に戻す
    draw();                       // 再描画
});

textInput.addEventListener('input', draw);

// 描画処理
function draw() {
    // ベースの背景色（ダークグレー）
    ctx.fillStyle = '#191919';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // 背景画像をクッキリ（等倍）描画
    if (backgroundImage) {
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.drawImage(backgroundImage, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }
    
    // テキストの描画設定
    const lines = textInput.value.split('\n');
    const fontSize = 84; 
    ctx.font = `${fontSize}px 'DotGothic16', sans-serif`;
    
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    const lineHeight = fontSize * 1.1;
    const margin = 24; 
    
    const strokeColor = '#31243b'; 
    const fillColor = '#a3f7bf';   
    const thickness = 8;           
    
    // 文字のフチ取り
    ctx.fillStyle = strokeColor;
    for (let dx = -thickness; dx <= thickness; dx += 2) {
        for (let dy = -thickness; dy <= thickness; dy += 2) {
            lines.forEach((line, index) => {
                const x = margin + dx;
                const y = margin + (index * lineHeight) + dy;
                ctx.fillText(line, x, y);
            });
        }
    }
    
    // 文字の中身
    ctx.fillStyle = fillColor;
    lines.forEach((line, index) => {
        const x = margin;
        const y = margin + (index * lineHeight);
        ctx.fillText(line, x, y);
    });
}

// 画像をつくるボタン
downloadBtn.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL('image/png');
    resultImg.src = dataUrl;
    resultWrap.style.display = 'block';
    resultWrap.scrollIntoView({ behavior: 'smooth' });
});

document.fonts.ready.then(() => { draw(); });
draw();
