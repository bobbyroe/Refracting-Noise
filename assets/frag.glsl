varying vec2 vUv;

float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9897, 78.233))) * 43758.5453123);
}

void main() {
  vec2 st = vUv; 
  st *= 9.0; // grid size
  vec2 ipos = floor(st);
  vec3 color = vec3(random(ipos));
  gl_FragColor = vec4(color, 1.0);
}