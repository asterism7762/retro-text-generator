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

// Canvasの基本サイズ（正方形）
const CANVAS_SIZE = 500;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

let backgroundImage = null;

// タイトルを【3回連続で素早くタップ】したときだけ管理モードを切り替える
let clickCount = 0;
let clickTimeout;

secretTrigger.addEventListener('click', () => {
    clickCount++;
    clearTimeout(clickTimeout);
    
    if (clickCount === 3) {
        adminUi.classList.toggle('hidden');
        clickCount = 0;
    } else {
        clickTimeout = setTimeout(() => {
            clickCount = 0;
        }, 500);
    }
});

// 管理モードで画像（猫など）が選ばれたとき
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

// クリアボタン
resetBtn.addEventListener('click', () => {
    imageInput.value = '';
    backgroundImage = null;
    draw();
});

// テキスト入力時に自動で再描画
textInput.addEventListener('input', draw);

// 描画処理
function draw() {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // ★キャラクター（背景画像）を下部中央に綺麗に配置する設定に戻しました
    if (backgroundImage) {
        // 画像がCanvasからはみ出さないように適度に縮小（最大幅300px程度に収める）
        const maxImgW = 300;
        const maxImgH = 200;
        let scale = 1;
        
        if (backgroundImage.width > maxImgW || backgroundImage.height > maxImgH) {
            scale = Math.min(maxImgW / backgroundImage.width, maxImgH / backgroundImage.height);
        }
        
        const imgW = backgroundImage.width * scale;
        const imgH = backgroundImage.height * scale;
        
        // 下部中央の座標を計算
        const x = (CANVAS_SIZE - imgW) / 2;
        const y = CANVAS_SIZE - imgH - 20; // 下端から20px上に浮かせる
        
        ctx.imageSmoothingEnabled = false; // ドットをくっきり
        ctx.drawImage(backgroundImage, x, y, imgW, imgH);
    }
    
    // テキストの描画設定
    const lines = textInput.value.split('\n');
    const fontSize = 64; 
    ctx.font = `${fontSize}px 'DotGothic16', sans-serif`;
    ctx.textAlign = 'center'; // ★文字を「中央揃え」に戻しました！
    ctx.textBaseline = 'middle';
    
    const lineHeight = fontSize * 1.2;
    const totalHeight = lineHeight * lines.length;
    
    // ★文字が上に、キャラクターが下にくるように全体の配置バランスを調整
    let startY = (CANVAS_SIZE - totalHeight) / 2 - 30; 
    
    // 太い紫色の縁取り
    ctx.strokeStyle = '#31243b'; 
    ctx.lineWidth = 16;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    // 文字の中身（ミントグリーン）
    ctx.fillStyle = '#a3f7bf';
    
    // 各行を描画
    lines.forEach((line, index) => {
        const x = CANVAS_SIZE / 2; // ★常に真ん中
        const y = startY + (index * lineHeight);
        
        ctx.strokeText(line, x, y);
        ctx.fillText(line, x, y);
    });
}

// 画像をつくるボタンが押されたとき
downloadBtn.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL('image/png');
    resultImg.src = dataUrl;
    resultWrap.style.display = 'block';
    resultWrap.scrollIntoView({ behavior: 'smooth' });
});

// 初回描画
document.fonts.ready.then(() => { draw(); });
draw();
