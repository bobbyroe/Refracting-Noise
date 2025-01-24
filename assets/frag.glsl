// #include <common>
uniform vec2 resolution;
uniform float time;

varying vec2 vUv;
float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9897, 78.233))) * 43758.5453123);
}

float circle(in vec2 _st, in float _radius) {
  vec2 dist = _st - vec2(0.5);
  return 1.0 - smoothstep(_radius - (_radius * 0.01), _radius + (_radius * 0.01), dot(dist, dist) * 4.0);
}

void main() {
  vec2 st = vUv; // gl_FragCoord.xy / resolution.xy;
  st *= 9.0; // grid size
  vec2 ipos = floor(st);
  vec2 fpos = fract(st);
  vec3 color = vec3(random(ipos));
//   vec3 color = vec3(fpos, 1.0);
  gl_FragColor = vec4(color, 1.0);
}