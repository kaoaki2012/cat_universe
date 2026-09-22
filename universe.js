// ======= 1. 基本セットアップ =======
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

// ======= 2. カメラ位置 =======
camera.position.z = 50;

// ======= 3. 星の色カテゴリ =======
const categoryColors = {
  "cat": 0xffcc00,
  "food": 0xff6699,
  "body": 0x66ccff,
  "emotion": 0x99ff99,
  "other": 0xffffff
};

// カテゴリ判定（簡易版）
function getCategory(word) {
  if (word.includes("猫")) return "cat";
  if (word.includes("食")) return "food";
  if (word.includes("体")) return "body";
  if (word.includes("気持ち")) return "emotion";
  return "other";
}

// ======= 4. JSON 読み込み =======
fetch("cat_space.json")   // ← VS Code ならこのままでOK
  .then(res => res.json())
  .then(data => {
    data.forEach(item => {
      const category = getCategory(item.word);
      const color = categoryColors[category] || 0xffffff;

     const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([item.x, item.y, item.z]);
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

const material = new THREE.PointsMaterial({
  color: color,
  size: 1.5,
  sizeAttenuation: true,
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending,
  map: new THREE.TextureLoader().load("circle.png"),
  alphaTest: 0.5
});

const star = new THREE.Points(geometry, material); 

      star.position.set(item.x, item.y, item.z);
      scene.add(star);
    });
  });

// ======= 5. アニメーション =======
function animate() {
  requestAnimationFrame(animate);
  scene.rotation.y += 0.002;
  renderer.render(scene, camera);
}
animate();

// ===============================
// 画面切り替えイベント
// ===============================

// 星の宇宙
document.getElementById("universeBtn").onclick = () => {
    window.location.href = "index.html";
};

// 意味回路
document.getElementById("circuitBtn").onclick = () => {
    window.location.replace("circuit.html");
};

// 神経回路
document.getElementById("neuralBtn").onclick = () => {
    window.location.href = "neural.html";
};

// ======= 6. 画面サイズ調整 =======

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
