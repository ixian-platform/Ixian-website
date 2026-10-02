/* True while the page is scrolling (and ~160 ms after); decorative canvas loops skip
   frames then so scrolling gets the main thread and GPU. */
let last = 0;
let on = false;
export function scrollBusy() {
  if (!on && typeof window !== 'undefined') {
    on = true;
    window.addEventListener('scroll', () => (last = performance.now()), { passive: true });
    window.addEventListener('wheel', () => (last = performance.now()), { passive: true });
    window.addEventListener('touchmove', () => (last = performance.now()), { passive: true });
  }
  return performance.now() - last < 160;
}
