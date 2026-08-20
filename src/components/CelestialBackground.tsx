import React, { useEffect, useRef } from 'react';

export const CelestialBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    function syncSize() {
      if (!canvas) return;
      const w = window.innerWidth || 1280;
      const h = window.innerHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    syncSize();
    window.addEventListener('resize', syncSize);

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 p = (uv - 0.5) * 2.0;
    p.x *= u_resolution.x / u_resolution.y;

    // Background gradient - soft daylight dawn sky / soft cosmic purple
    vec3 topColor = vec3(0.09, 0.08, 0.16); // Deep cosmic navy
    vec3 bottomColor = vec3(0.18, 0.15, 0.28); // Soft mystic violet
    vec3 color = mix(bottomColor, topColor, uv.y);

    // Stars
    float starSelection = noise(uv * 120.0);
    if (starSelection > 0.993) {
        float twinkle = sin(u_time * 2.5 + starSelection * 20.0) * 0.5 + 0.5;
        color += vec3(0.95, 0.92, 1.0) * twinkle * 0.9;
    }

    // Secondary subtle small stars
    float miniStars = noise(uv * 280.0);
    if (miniStars > 0.997) {
        float twinkle2 = cos(u_time * 3.0 + miniStars * 15.0) * 0.5 + 0.5;
        color += vec3(1.0, 0.95, 0.8) * twinkle2 * 0.6;
    }

    // Nebula clouds
    float n = noise(uv * 3.5 + u_time * 0.04);
    color += vec3(0.47, 0.41, 0.9) * n * 0.07;

    // Mouse ambient glow
    vec2 mouseNorm = u_mouse / u_resolution;
    float dist = length(uv - mouseNorm);
    float glow = smoothstep(0.4, 0.0, dist) * 0.04;
    color += vec3(0.72, 0.68, 1.0) * glow;

    gl_FragColor = vec4(color, 1.0);
}`;

    function createShader(type: number, src: string) {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, vs);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const handleMouseMove = (event: MouseEvent) => {
      mousePos.x = event.clientX;
      mousePos.y = window.innerHeight - event.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    function render(t: number) {
      if (!gl || !canvas) return;
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mousePos.x, mousePos.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', syncSize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* WebGL starry canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-35 transition-opacity duration-1000"
        style={{ display: 'block' }}
      />
      {/* Lavender / Violet ambient gradient overlay */}
      <div className="absolute inset-0 bg-radial-[circle_at_top_right] from-[#B8B5FF]/25 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-radial-[circle_at_bottom_left] from-[#5947c5]/10 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
