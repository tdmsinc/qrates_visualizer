precision mediump float;

varying vec2 vUv;

uniform float time;
uniform sampler2D texture;

uniform int mode;

void main()
{
  vec4 texColor = texture2D(texture, vUv);

  if (2 == mode) {
    float gray = dot(texColor.rgb, vec3(0.3, 0.59, 0.11));
    gl_FragColor = vec4(gray, gray, gray, 1.0);
  } else {
    gl_FragColor = texColor;
  }
}