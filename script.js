const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

// Pendulum and Cart Parameters
let cartX = canvas.width / 2;
let cartY = 300;
let pendulumLength = 150;
let angle = Math.PI / 4; // Initial angle
let angleVelocity = 0;
let angleAcceleration = 0;
let gravity = 0.98;
let damping = 0.995; // Damping factor to slow down motion

function drawCart() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(cartX - 50, cartY, 100, 30);
}

function drawPendulum() {
  let pendulumX = cartX + pendulumLength * Math.sin(angle);
  let pendulumY = cartY + pendulumLength * Math.cos(angle);
  
  ctx.beginPath();
  ctx.moveTo(cartX, cartY);
  ctx.lineTo(pendulumX, pendulumY);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(pendulumX, pendulumY, 10, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
}

function updatePhysics() {
  angleAcceleration = (-gravity / pendulumLength) * Math.sin(angle);
  angleVelocity += angleAcceleration;
  angleVelocity *= damping; // Apply damping
  angle += angleVelocity;
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCart();
  drawPendulum();
  updatePhysics();
  requestAnimationFrame(animate);
}

animate();
