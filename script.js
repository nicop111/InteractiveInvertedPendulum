const canvas = document.getElementById('simulationCanvas');
canvas.width = 1000;
canvas.height = 550;
const ctx = canvas.getContext('2d');


const h = 1 / 60; // Fixed stepsize for simulation and animation
const l = 1;
const scaling = 200; // Example scaling 1000 pixels per meter
let time = 0;
let total_energy = 0;

let state = [canvas.width/2/scaling, 0, 0, 0]; // Initial state [x, x_dot, phi, phi_dot]
let target_x = state[0]; // Target position for the cart

// Event Listener for Mouse Movement
canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  target_x = (event.clientX - rect.left) / scaling; // Get mouse position relative to canvas
});

function updatePhysics() {
  let force_ext = 20000 * (target_x - state[0]) - 1500 * state[1];

  time += h;

  state = rungeKuttaStep(state, force_ext, h);  

}

function rungeKuttaStep(state, force_ext, h) {
  let k1 = dynamics(state, force_ext);
  let k2 = dynamics(state.map((val, i) => val + (h / 2) * k1[i]), force_ext);
  let k3 = dynamics(state.map((val, i) => val + (h / 2) * k2[i]), force_ext);
  let k4 = dynamics(state.map((val, i) => val + h * k3[i]), force_ext);
  let new_state = state.map((val, i) => val + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
  // Normalize phi to [0, 2*pi]
  if (new_state[2] > 2*Math.PI) {
    new_state[2] -= 2 * Math.PI;
  }
  if (new_state[2] < 0) {
    new_state[2] += 2 * Math.PI;
  }
  return new_state;
}

function dynamics(state, force_ext) {
  // Dynamics of a cart 
  // state = [x, x_dot, phi, phi_dot]
  // return = [x_dot, x_ddot, phi_dot, phi_ddot]
  const g = -9.81;
  const mc = 100;
  const mp = 1;
  const damping = 1;
  
  let x = state[0];
  let x_dot = state[1];
  let phi = state[2];
  let phi_dot = state[3];
  
  total_energy = (mp * Math.pow(x_dot - l * phi_dot * Math.cos(phi), 2)) / 2 + (mc * Math.pow(x_dot, 2)) / 2 + (Math.pow(l, 2) * mp * Math.pow(phi_dot, 2) * Math.pow(Math.sin(phi), 2)) / 2 - g * l * mp * (Math.cos(phi) + 1);

  let x_ddot = (l * mp * Math.sin(phi) * Math.pow(phi_dot, 2) + force_ext + g * mp * Math.cos(phi) * Math.sin(phi)) / 
  (-mp * Math.pow(Math.cos(phi), 2) + mc + mp);
  
  let phi_ddot = -(l * mp * Math.cos(phi) * Math.sin(phi) * Math.pow(phi_dot, 2) 
  + force_ext * Math.cos(phi) + g * mc * Math.sin(phi) + g * mp * Math.sin(phi)) / 
  (l * (-mp * Math.pow(Math.cos(phi), 2) + mc + mp));

  x_dot *= damping;
  phi_dot *= damping;
    
  return [x_dot, x_ddot, phi_dot, phi_ddot];
}

function draw() { 
  let x = scaling * state[0];
  let phi = state[2];
  const y = 300;
  const l_plot = scaling*l;

  // Draw the cart
  ctx.fillStyle = 'grey';
  ctx.fillRect(x - 50, y, 100, 30);

  // Draw the pendulum
  let pendulumX = x + l_plot * Math.sin(phi); // Example scaling
  let pendulumY = y - l_plot * Math.cos(phi);

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(pendulumX, pendulumY);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(pendulumX, pendulumY, 10, 0, Math.PI * 2);
  ctx.fillStyle = 'black';
  ctx.fill();

  // Display the current state as text
  ctx.font = '16px Arial';
  ctx.fillStyle = 'black';
  const labels = ['x', 'x_dot', 'phi', 'phi_dot'];

  state.forEach((value, index) => {
    ctx.fillText(`${labels[index]}: ${value.toFixed(2)}`, 10, 20 * (index + 1));
  });
  // Display total energy
  ctx.fillText(`energy: ${total_energy.toFixed(2)}`, 10, 20 * (state.length + 1));
  // Display elapsed time
  ctx.fillText(`time: ${time.toFixed(2)} s`, 10, 20 * (state.length + 2));
}

// Run simulation at fixed frequency (e.g., 60 Hz)
setInterval(() => {
  updatePhysics();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw();
}, 1000 * h); // 1000 ms divided by 60 Hz
