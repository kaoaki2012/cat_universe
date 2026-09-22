console.log("circuit.js 読み込み OK");

// ===============================
// ① Three.js 基本セットアップ
// ===============================

// ===============================
// ② ノードとエッジの読み込み
// ===============================
console.log("circuit.js 読み込み OK");

    // Three.js 初期化
    const canvas = document.getElementById("canvas");
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.lookAt(scene.position);
    camera.position.z = 150;
    camera.position.y = 50;    // 上から見下ろす

// JSON 読み込み
fetch("cat_space.json")
  .then(response => response.json())
  .then(data => {
    console.log("JSON 読み込み OK:", data.length);

    // data は配列なので nodes を自分で作る
    const SCALE = 10;
    // まず生の座標をそのまま取る
    const rawNodes = data.map((item, index) => ({
      id: index,
      x: item.x,
      y: item.y,
      z: item.z
    }));

    // 重心（平均位置）を計算
    let cx = 0, cy = 0, cz = 0;
    rawNodes.forEach(n => {
      cx += n.x;
      cy += n.y;
      cz += n.z;
    });
    cx /= rawNodes.length;
    cy /= rawNodes.length;
    cz /= rawNodes.length;

    // 重心を原点にずらして、SCALE を掛ける
    const nodes = rawNodes.map(n => ({
      id: n.id,
      x: (n.x - cx) * SCALE,
      y: (n.y - cy) * SCALE,
      z: (n.z - cz) * SCALE
    }));
    

    console.log("nodes:", nodes);

      // ノード描画
    nodes.forEach(node => {
      const geometry = new THREE.SphereGeometry(0.5, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(node.x, node.y, node.z);
      scene.add(sphere);
    });
    
     const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x66ccff,      // 明るい青
      transparent: true,
      opacity: 0.4          // 透明感
    });

    // エッジ描画（青い線）
    nodes.forEach((start, i) => {
      nodes.forEach((end, j) => {
        if (i >= j) return;

        const dx = start.x - end.x;
        const dy = start.y - end.y;
        const dz = start.z - end.z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        if (dist < 10) {  // 距離の閾値
          const points = [
            new THREE.Vector3(start.x, start.y, start.z),
            new THREE.Vector3(end.x, end.y, end.z)
          ];

          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(geometry, edgeMaterial);
          scene.add(line);
        }
      });
    });

    renderer.render(scene, camera);
  })
  .catch(err => console.error("JSON 読み込みエラー:", err));

// ===============================
// ③ アニメーション
// ===============================
function animate() {
  requestAnimationFrame(animate);

  camera.position.x = Math.sin(Date.now() * 0.0003) * 50;
  camera.position.z = Math.cos(Date.now() * 0.0003) * 50;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

animate();



