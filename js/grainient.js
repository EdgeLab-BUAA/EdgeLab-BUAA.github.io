const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ];
};

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}
void mainImage(out vec4 o, vec2 C){
  float t=iTime*uTimeSpeed;
  vec2 uv=C/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);

  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;

  float frequency=uWarpFrequency;
  float ws=max(uWarpStrength,0.001);
  float amplitude=uWarpAmplitude/ws;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);

  vec3 colLav=uColor1;
  vec3 colOrg=uColor2;
  vec3 colDark=uColor3;
  float b=uColorBalance;
  float s=max(uBlendSoftness,0.0);
  mat2 blendRot=Rot(radians(uBlendAngle));
  float blendX=(tuv*blendRot).x;
  float edge0=-0.3-b-s;
  float edge1=0.2-b+s;
  float v0=0.5-b+s;
  float v1=-0.3-b-s;
  vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));
  vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));
  vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));

  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);}
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;

  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  col=clamp(col,0.0,1.0);

  o=vec4(col,1.0);
}
void main(){
  vec4 o=vec4(0.0);
  mainImage(o,gl_FragCoord.xy);
  fragColor=o;
}
`;

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }
  return shader;
};

const createProgram = (gl) => {
  const program = gl.createProgram();
  gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertex));
  gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragment));
  gl.bindAttribLocation(program, 0, "position");
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }
  return program;
};

const initGrainient = (container, options = {}) => {
  const settings = {
    timeSpeed: 0.25,
    colorBalance: 0,
    warpStrength: 1,
    warpFrequency: 5,
    warpSpeed: 2,
    warpAmplitude: 50,
    blendAngle: 0,
    blendSoftness: 0.05,
    rotationAmount: 500,
    noiseScale: 2,
    grainAmount: 0.1,
    grainScale: 2,
    grainAnimated: false,
    contrast: 1.5,
    gamma: 1,
    saturation: 1,
    centerX: 0,
    centerY: 0,
    zoom: 0.9,
    color1: "#FF9FFC",
    color2: "#5227FF",
    color3: "#B497CF",
    ...options
  };

  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
    preserveDrawingBuffer: false
  });

  if (!gl) {
    container.classList.add("grainient-fallback");
    return;
  }

  canvas.className = "grainient-canvas";
  container.appendChild(canvas);

  const program = createProgram(gl);
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const uniform = (name) => gl.getUniformLocation(program, name);
  const uniforms = {
    iResolution: uniform("iResolution"),
    iTime: uniform("iTime"),
    uTimeSpeed: uniform("uTimeSpeed"),
    uColorBalance: uniform("uColorBalance"),
    uWarpStrength: uniform("uWarpStrength"),
    uWarpFrequency: uniform("uWarpFrequency"),
    uWarpSpeed: uniform("uWarpSpeed"),
    uWarpAmplitude: uniform("uWarpAmplitude"),
    uBlendAngle: uniform("uBlendAngle"),
    uBlendSoftness: uniform("uBlendSoftness"),
    uRotationAmount: uniform("uRotationAmount"),
    uNoiseScale: uniform("uNoiseScale"),
    uGrainAmount: uniform("uGrainAmount"),
    uGrainScale: uniform("uGrainScale"),
    uGrainAnimated: uniform("uGrainAnimated"),
    uContrast: uniform("uContrast"),
    uGamma: uniform("uGamma"),
    uSaturation: uniform("uSaturation"),
    uCenterOffset: uniform("uCenterOffset"),
    uZoom: uniform("uZoom"),
    uColor1: uniform("uColor1"),
    uColor2: uniform("uColor2"),
    uColor3: uniform("uColor3")
  };

  gl.uniform1f(uniforms.uTimeSpeed, settings.timeSpeed);
  gl.uniform1f(uniforms.uColorBalance, settings.colorBalance);
  gl.uniform1f(uniforms.uWarpStrength, settings.warpStrength);
  gl.uniform1f(uniforms.uWarpFrequency, settings.warpFrequency);
  gl.uniform1f(uniforms.uWarpSpeed, settings.warpSpeed);
  gl.uniform1f(uniforms.uWarpAmplitude, settings.warpAmplitude);
  gl.uniform1f(uniforms.uBlendAngle, settings.blendAngle);
  gl.uniform1f(uniforms.uBlendSoftness, settings.blendSoftness);
  gl.uniform1f(uniforms.uRotationAmount, settings.rotationAmount);
  gl.uniform1f(uniforms.uNoiseScale, settings.noiseScale);
  gl.uniform1f(uniforms.uGrainAmount, settings.grainAmount);
  gl.uniform1f(uniforms.uGrainScale, settings.grainScale);
  gl.uniform1f(uniforms.uGrainAnimated, settings.grainAnimated ? 1 : 0);
  gl.uniform1f(uniforms.uContrast, settings.contrast);
  gl.uniform1f(uniforms.uGamma, settings.gamma);
  gl.uniform1f(uniforms.uSaturation, settings.saturation);
  gl.uniform2f(uniforms.uCenterOffset, settings.centerX, settings.centerY);
  gl.uniform1f(uniforms.uZoom, settings.zoom);
  gl.uniform3fv(uniforms.uColor1, hexToRgb(settings.color1));
  gl.uniform3fv(uniforms.uColor2, hexToRgb(settings.color2));
  gl.uniform3fv(uniforms.uColor3, hexToRgb(settings.color3));

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = container.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uniforms.iResolution, width, height);
    }
  };

  let raf = 0;
  let isVisible = true;
  let isPageVisible = !document.hidden;
  const start = performance.now();

  const render = (time) => {
    resize();
    gl.uniform1f(uniforms.iTime, (time - start) * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(render);
  };

  const tryStart = () => {
    if (isVisible && isPageVisible && raf === 0) {
      raf = requestAnimationFrame(render);
    }
  };
  const tryStop = () => {
    if (raf !== 0) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  const intersectionObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible) tryStart();
    else tryStop();
  });
  intersectionObserver.observe(container);

  document.addEventListener("visibilitychange", () => {
    isPageVisible = !document.hidden;
    if (isPageVisible) tryStart();
    else tryStop();
  });

  tryStart();
};

document.addEventListener("DOMContentLoaded", () => {
  const grainient = document.querySelector(".grainient-container");
  if (grainient) initGrainient(grainient);
});
