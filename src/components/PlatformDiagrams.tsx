/** Original SVG diagrams in the style of the reference's platform page (dark, red/teal rings). */

export function InfinityLoop() {
  return (
    <svg viewBox="0 0 640 280" className="mx-auto w-full max-w-3xl" role="img" aria-label="Data foundation and AI-native platform joined by a single sensor">
      <defs>
        <linearGradient id="lt" x1="0" x2="1"><stop offset="0" stopColor="#1a8f98" /><stop offset="1" stopColor="#0c3a40" /></linearGradient>
        <linearGradient id="lr" x1="1" x2="0"><stop offset="0" stopColor="#ff2a1f" /><stop offset="1" stopColor="#5a0000" /></linearGradient>
      </defs>
      <circle cx="210" cy="140" r="112" fill="none" stroke="url(#lt)" strokeWidth="26" opacity=".9" />
      <circle cx="430" cy="140" r="112" fill="none" stroke="url(#lr)" strokeWidth="26" opacity=".9" />
      <circle cx="210" cy="140" r="84" fill="#06090c" /><circle cx="430" cy="140" r="84" fill="#0b0405" />
      <circle cx="320" cy="140" r="58" fill="#ec0000" />
      <circle cx="320" cy="140" r="66" fill="none" stroke="#ff6a5c" strokeOpacity=".4" strokeWidth="2" />
      <g fill="#fff" fontFamily="var(--f-display), Arial" textAnchor="middle">
        <text x="320" y="136" fontSize="15" fontWeight="800">Single</text>
        <text x="320" y="156" fontSize="15" fontWeight="800">sensor</text>
        <text x="170" y="145" fontSize="17" fontWeight="700">Data</text>
        <text x="170" y="166" fontSize="17" fontWeight="700">Foundation</text>
        <text x="470" y="145" fontSize="17" fontWeight="700">AI-native</text>
        <text x="470" y="166" fontSize="17" fontWeight="700">Platform</text>
      </g>
    </svg>
  );
}

export function Rings() {
  const ring = (id: string, r: number) => `M ${240 - r},240 a ${r},${r} 0 1,1 ${2 * r},0 a ${r},${r} 0 1,1 ${-2 * r},0`;
  return (
    <svg viewBox="0 0 480 480" className="mx-auto w-full max-w-md" role="img" aria-label="Layered platform: core, control plane, coverage plane, platform and services">
      <defs>
        <path id="p1" d={ring("p1", 200)} />
        <path id="p2" d={ring("p2", 160)} />
        <path id="p3" d={ring("p3", 120)} />
      </defs>
      <circle cx="240" cy="240" r="200" fill="none" stroke="#ec0000" strokeWidth="34" />
      <circle cx="240" cy="240" r="160" fill="none" stroke="#12363b" strokeWidth="34" />
      <circle cx="240" cy="240" r="120" fill="none" stroke="#e9ecef" strokeWidth="34" />
      <circle cx="240" cy="240" r="84" fill="#0b0d11" stroke="#3a4048" />
      <g fontFamily="var(--f-display), Arial" fontWeight="800" letterSpacing="3" fontSize="13">
        <text fill="#fff"><textPath href="#p1" startOffset="25%" textAnchor="middle">PLATFORM + SERVICES</textPath></text>
        <text fill="#7fd0d6"><textPath href="#p2" startOffset="25%" textAnchor="middle">COVERAGE PLANE</textPath></text>
        <text fill="#14181f"><textPath href="#p3" startOffset="25%" textAnchor="middle">CONTROL PLANE</textPath></text>
      </g>
      <circle cx="240" cy="240" r="58" fill="#ec0000" />
      <text x="240" y="236" textAnchor="middle" fill="#fff" fontFamily="var(--f-display), Arial" fontWeight="800" fontSize="16">Analyst</text>
      <text x="240" y="256" textAnchor="middle" fill="#fff" fontFamily="var(--f-display), Arial" fontWeight="800" fontSize="16">AI core</text>
    </svg>
  );
}
