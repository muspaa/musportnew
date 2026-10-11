export const toolSlug = (name: string) => name.toLowerCase().replace(/ /g, '-');
const monochrome=new Set(['ChatGPT','GitHub','Vercel','v0','Copilot','Google AI Studio','Railway']);
export default function ToolIcon({ name }: { name: string }) {
  if(name==='Kimi')return <span className="brand-tool-icon tool-kimi"><img className="kimi-dark" src="/images/tools/kimi.svg" alt="" width="28" height="28" loading="lazy"/><img className="kimi-light" src="/images/tools/kimi-light.svg" alt="" width="28" height="28" loading="lazy"/></span>;
  return <img className={`brand-tool-icon tool-${toolSlug(name)} ${monochrome.has(name)?'tool-monochrome':''} ${name==='Codex'?'tool-reverse':''}`} src={`/images/tools/${toolSlug(name)}.svg`} alt="" width="28" height="28" loading="lazy"/>;
}
