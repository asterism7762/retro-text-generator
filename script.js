const DEFAULT_IMAGE_URL = 'cat.png'; 

const canvas = document.getElementById('preview-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const textInput = document.getElementById('text-input');
const downloadBtn = document.getElementById('download-btn');
const resultWrap = document.getElementById('result-wrap');
const resultImg = document.getElementById('result-img');
const secretTrigger = document.getElementById('secret-trigger');
const adminUi = document.getElementById('admin-ui');
const imageInput = document.getElementById('image-input');
const resetBtn = document.getElementById('reset-btn');

const CANVAS_SIZE = 500;
if (canvas) {
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
}

let backgroundImage = null;
let defaultImg = null;

// 起動時にデフォルトの猫画像を読み込む
if (ctx) {
    defaultImg = new Image();
    defaultImg.onload = () => {
        backgroundImage = defaultImg;
        draw();
    };
    defaultImg.onerror = () => {
        console.log("cat.png が見つかりません。画像なしでプレビューを表示します。");
        draw(); 
    };
    defaultImg.src = DEFAULT_IMAGE_URL;
}

// タイトルを「1秒以内に連続5回タップ」した時だけ切り替える
let clickCount = 0;
let clickTimer = null;
if (secretTrigger && adminUi) {
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
}

// 管理メニューで別の画像が選ばれたとき
if (imageInput) {
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                backgroundImage = img;
                draw();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// リresetボタン（最初の猫のドット絵に戻す）
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        if (imageInput) imageInput.value = '';
        backgroundImage = defaultImg;
        draw();
    });
}

if (textInput) {
    textInput.addEventListener('input', draw);
}

// 描画処理
function draw() {
    if (!ctx) return;

    // 1. ベースの背景色を塗りつぶし
    ctx.fillStyle = '#191919';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // 2. 背景画像をドット絵（鮮明）のまま画面ぴったりに描画
    if (backgroundImage) {
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.drawImage(backgroundImage, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }
    
    // 3. テキストの描画設定
    const textValue = textInput ? textInput.value : "わりと\nどうでも\nいい";
    const lines = textValue.split('\n');
    const fontSize = 84; 
    ctx.font = `${fontSize}px 'DotGothic16', sans-serif`;
    
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    const lineHeight = fontSize * 1.1;
    const margin = 24; 
    
    const strokeColor = '#31243b'; 
    const fillColor = '#a3f7bf';   
    const thickness = 8;           
    
    // 4. 文字の縁取りを重ね描き
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
    
    // 5. 文字の中身を描画
    ctx.fillStyle = fillColor;
    lines.forEach((line, index) => {
        const x = margin;
        const y = margin + (index * lineHeight);
        ctx.fillText(line, x, y);
    });
}

// 画像をつくるボタン
if (downloadBtn && resultImg && resultWrap) {
    downloadBtn.addEventListener('click', () => {
        const dataUrl = canvas.toDataURL('image/png');
        resultImg.src = dataUrl;
        resultWrap.style.display = 'block';
        resultWrap.scrollIntoView({ behavior: 'smooth' });
    });
}

document.fonts.ready.then(() => { draw(); });
draw();
