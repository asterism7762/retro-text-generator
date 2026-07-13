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
    
    // 背景画像があれば中央に描画
    if (backgroundImage) {
        const scale = Math.max(CANVAS_SIZE / backgroundImage.width, CANVAS_SIZE / backgroundImage.height);
        const x = (CANVAS_SIZE - backgroundImage.width * scale) / 2;
        const y = (CANVAS_SIZE - backgroundImage.height * scale) / 2;
        
        // ドット絵をくっきり表示する設定
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(backgroundImage, x, y, backgroundImage.width * scale, backgroundImage.height * scale);
    }
    
    // テキストの描画設定
    const lines = textInput.value.split('\n');
    const fontSize = 64; 
    ctx.font = `${fontSize}px 'DotGothic16', sans-serif`;
    ctx.textAlign = 'left'; 
    ctx.textBaseline = 'middle';
    
    const lineHeight = fontSize * 1.2;
    const totalHeight = lineHeight * lines.length;
    let startY = (CANVAS_SIZE - totalHeight) / 2 + lineHeight / 2;
    
    // 太い紫色の縁取り
    ctx.strokeStyle = '#31243b'; 
    ctx.lineWidth = 16;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    // 文字の中身（ミントグリーン）
    ctx.fillStyle = '#a3f7bf';
    
    // 各行を描画
    lines.forEach((line, index) => {
        const x = 40; 
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

// 初回描画（フォント読み込みを待って実行）
document.fonts.ready.then(() => { draw(); });
draw();
