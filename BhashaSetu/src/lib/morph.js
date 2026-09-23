import { useEffect, useRef, useState } from 'react';

// Smoothly interpolates between SVG path strings that share the same command structure.
const NUM = /-?\d+(?:\.\d+)?/g;
const parse = (s) => (s.match(NUM) || []).map(Number);
const pieces = (s) => s.split(NUM);
const build = (tpl, nums) => tpl.reduce((out, p, i) => out + p + (i < nums.length ? +nums[i].toFixed(2) : ''), '');

export function useMorph(target, ms = 200) {
  const [value, setValue] = useState(target);
  const cur = useRef(parse(target));
  useEffect(() => {
    const from = cur.current.slice();
    const to = parse(target);
    const tpl = pieces(target);
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / ms);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const arr = from.map((f, i) => f + (to[i] - f) * e);
      cur.current = arr;
      setValue(build(tpl, arr));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return value;
}
