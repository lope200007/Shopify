const cj = require('./cj');
const PIDS = process.argv.slice(2);
(async () => {
  const out = [];
  for (const pid of PIDS) {
    try {
      const d = await cj.detalle({ pid });
      const p = Array.isArray(d) ? d[0] : d;
      out.push(p);
      console.error('%s  %s  variantes=%d', pid, (p.productNameEn||'').slice(0,52), (p.variants||[]).length);
    } catch (e) { console.error(pid, '->', e.message); }
  }
  require('fs').writeFileSync('/tmp/claude-0/-home-user-libre/917f3732-f020-5fa4-b126-7adc8cf2b4f6/scratchpad/detalles.json', JSON.stringify(out, null, 1));
})();
