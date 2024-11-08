const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

// Pendulum and Cart Parameters
let cartX = canvas.width / 2;
let cartY = 300;
let pendulumLength = 150;
let angle = Math.PI * 3/4; // Initial angle
let angleVelocity = 0;
let angleAcceleration = 0;
let gravity = 0.98;
let damping = 0.995; // Damping factor to slow motion

let targetCartX = cartX; // Target position for the cart
let cartVelocity = 0; // Cart velocity
let cartAcceleration = 0; // Cart acceleration

// Event Listener for Mouse Movement
canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  targetCartX = event.clientX - rect.left; // Get mouse position relative to canvas
});

function drawCart() {
  ctx.fillStyle = 'grey';
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
  ctx.fillStyle = 'black';
  ctx.fill();
}

function updateCartPosition() {
  const cartSpeed = 0.1; // Speed factor for smoother cart movement
  let previousCartX = cartX;
  cartX += (targetCartX - cartX) * cartSpeed;
  cartVelocity = cartX - previousCartX; // Calculate velocity
  cartAcceleration = cartVelocity - (previousCartX - (cartX - cartVelocity)); // Approximate acceleration
}

function updatePhysics() {
  // Update pendulum dynamics with cart acceleration
  angleAcceleration = (-gravity / pendulumLength) * Math.sin(angle) 
                      - (cartAcceleration / pendulumLength) * Math.cos(angle);
  angleVelocity += angleAcceleration;
  angleVelocity *= damping; // Apply damping
  angle += angleVelocity;
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateCartPosition();
  drawCart();
  drawPendulum();
  updatePhysics();
  requestAnimationFrame(animate);
}

animate();
