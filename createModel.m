clear; clc

syms mc mp l phi phi_dot x x_dot g force_ext force_pend_x force_pend_y damping_x damping_phi

A = [mc+mp l*mp*cos(phi); l*mp*cos(phi) mp*l^2];

b = [-phi_dot^2*l*mp*sin(phi);
    0];

g_vec = [0; 
    mp*g*l*sin(phi)];

F = [force_ext; 
    0] + [0; l*sin(phi)]*force_pend_y + [1; l*cos(phi)]*force_pend_x;

damping = [damping_x*x_dot
    damping_phi*phi_dot];

q_ddot = simplify(A\(F - b - g_vec - damping));

kinetic_energy = 1/2*mc*x_dot^2 + 1/2*mp*[x_dot+phi_dot*l*cos(phi) phi_dot*l*sin(phi)]*[x_dot+phi_dot*l*cos(phi); phi_dot*l*sin(phi)];
potential_energy = mp*g*l*(1-cos(phi));

total_energy = simplify(kinetic_energy + potential_energy);
