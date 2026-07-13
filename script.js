// 【設定】デフォルトで読み込む猫の画像ファイル名（環境に合わせて変更してください）
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

// Canvasの基本サイズ（正方形）
const CANVAS_SIZE = 500;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

let backgroundImage = null;

// 起動時にデフォルトの猫の画像を自動で読み込む
const defaultImg = new Image();
defaultImg.onload = () => {
    backgroundImage = defaultImg;
    draw();
};
defaultImg.onerror = () => {
    console.log("デフォルト画像が見つからないため、テキストのみで初期描画します。");
    draw();
};
defaultImg.src = DEFAULT_IMAGE_URL;

// タイトルをタップすると【管理モード】が切り替わる隠し機能
secretTrigger.addEventListener('click', () => {
    adminUi.classList.toggle('hidden');
});

// 管理モードで画像が選ばれたとき
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

// クリアボタン（デフォルトの猫画像に戻す）
resetBtn.addEventListener('click', () => {
    imageInput.value = '';
    backgroundImage = defaultImg;
    draw();
});

// テキスト入力時に自動で再描画
textInput.addEventListener('input', draw);

// 描画処理
function draw() {
    // 1. 背景をダークグレーで塗りつぶす
    ctx.fillStyle = '#191919';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // 2. 背景画像（猫）があれば下部中央にドット絵として描画
    if (backgroundImage) {
        // 画像の横幅をキャンバスの80%の大きさに調整
        const displayWidth = CANVAS_SIZE * 0.8;
        const scale = displayWidth / backgroundImage.width;
        const displayHeight = backgroundImage.height * scale;
        
        // 左右中央、下端ぴったりに配置
        const x = (CANVAS_SIZE - displayWidth) / 2;
        const y = CANVAS_SIZE - displayHeight;
        
        // ドット絵をくっきり表示する設定
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(backgroundImage, x, y, displayWidth, displayHeight);
    }
    
    // 3. テキストの描画設定
    const lines = textInput.value.split('\n');
    const fontSize = 80; // 画像に合わせて文字を大きく変更
    ctx.font = `${fontSize}px 'DotGothic16', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const lineHeight = fontSize * 1.1; // 行間
    let startY = 75; // 1行目のY座標（上寄りに固定して猫と被らないように配置）
    
    const strokeColor = '#31243b'; // 太い紫色の縁取り色
    const fillColor = '#a3f7bf';   // 文字の中身（ミントグリーン）
    const thickness = 6;           // 縁取りの太さ（ピクセル数）
    
    // 4. 文字の縁取りをドット絵風（カクカク）に描画
    // 上下左右斜めに少しずつずらして塗りつぶすことで、ドットフォントの階段状のアウトラインを作ります
    ctx.fillStyle = strokeColor;
    for (let dx = -thickness; dx <= thickness; dx += 2) {
        for (let dy = -thickness; dy <= thickness; dy += 2) {
            if (dx === 0 && dy === 0) continue;
            lines.forEach((line, index) => {
                const x = CANVAS_SIZE / 2 + dx;
                const y = startY + (index * lineHeight) + dy;
                ctx.fillText(line, x, y);
            });
        }
    }
    
    // 5. 文字の「中身」を描画
    ctx.fillStyle = fillColor;
    lines.forEach((line, index) => {
        const x = CANVAS_SIZE / 2;
        const y = startY + (index * lineHeight);
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

// 初回描画（フォント読み込みを待って実行）
document.fonts.ready.then(() => { draw(); });
draw();
