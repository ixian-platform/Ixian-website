export function isLowPerformance() {
  if (typeof window === 'undefined') return false;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');

  if (!gl) return true; // No WebGL = weak device

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    if (renderer.toLowerCase().includes('software')) return true; // Software rendering = no HW acceleration
  }

  return false; // WebGL + hardware acceleration = good performance
}
