clear

syms cartMass pendulumMass pendulumLength angle angleVelocity cartX gravity force_ext

A = [cartMass+pendulumMass pendulumLength*pendulumMass*cos(angle); pendulumLength*pendulumMass*cos(angle) pendulumMass+pendulumLength^2];

A_inv = simplify(inv(A));

b = [-angleVelocity^2*pendulumLength*pendulumMass*sin(angle);0];

g_vec = [0; pendulumMass*gravity*pendulumLength*sin(angle)];

F = [force_ext; 0];

q_ddot = simplify(A_inv* (F - b - g_vec));
