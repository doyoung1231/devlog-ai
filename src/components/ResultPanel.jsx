import { useEffect, useState } from 'react';

const LABELS = {
  en: {
    analysis_complete: 'ANALYSIS COMPLETE',
    code_review_mode: 'CODE REVIEW MODE',
    root_cause: '🚨 ROOT CAUSE',
    error_location: '📍 ERROR LOCATION',
    fix_steps: '🛠 FIX STEPS',
    code_patch: '💻 CODE PATCH',
    problems: '🔎 PROBLEMS DETECTED',
    improvements: '🛠 IMPROVEMENTS',
    performance: '⚡ PERFORMANCE NOTES',
    security: '🔐 SECURITY NOTES',
    confidence: 'CONFIDENCE',
    high: 'HIGH', medium: 'MEDIUM', low: 'LOW',
    file: 'FILE', info: 'INFO',
  },
  ko: {
    analysis_complete: '분석 완료',
    code_review_mode: '코드 리뷰 모드',
    root_cause: '🚨 근본 원인',
    error_location: '📍 에러 위치',
    fix_steps: '🛠 수정 단계',
    code_patch: '💻 코드 패치',
    problems: '🔎 발견된 문제',
    improvements: '🛠 개선 사항',
    performance: '⚡ 성능 노트',
    security: '🔐 보안 노트',
    confidence: '신뢰도',
    high: '높음', medium: '보통', low: '낮음',
    file: '파일', info: '정보',
  }
};

function DiffBlock({ diff, language, filename }) {
  if (!diff) return null;
  const lines = diff.split('\n');
  return (
    <div className="mt-3 rounded overflow-hidden border border-terminal-border">
      {filename && (
        <div className="px-4 py-2 bg-terminal-border/50 font-mono text-xs text-terminal-dim flex items-center gap-2">
          <span className="text-terminal-accent">▸</span>
          {filename}
          {language && <span className="ml-auto text-terminal-muted">{language}</span>}
        </div>
      )}
      <div className="p-4 bg-black/30 overflow-x-auto">
        {lines.map((line, i) => {
          let cls = 'font-mono text-xs leading-6 block whitespace-pre px-2 rounded';
          if (line.startsWith('+ ') || line.startsWith('+\t')) cls += ' diff-add';
          else if (line.startsWith('- ') || line.startsWith('-\t')) cls += ' diff-remove';
          else cls += ' text-terminal-dim';
          return <span key={i} className={cls}>{line || ' '}</span>;
        })}
      </div>
    </div>
  );
}

function ConfidenceBadge({ value, lang }) {
  const L = LABELS[lang];
  const color = value >= 85 ? '#7bc67e' : value >= 65 ? '#ffd700' : '#ff5f5f';
  const label = value >= 85 ? L.high : value >= 65 ? L.medium : L.low;
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-xs font-bold"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
      <span>{L.confidence}</span>
      <span>{value}%</span>
      <span className="opacity-60">· {label}</span>
    </div>
  );
}

function Section({ label, color = '#8892a4', children }) {
  return (
    <div className="terminal-card animate-fade-in">
      <div className="terminal-card-header">
        <div className="w-1 h-4 rounded" style={{ background: color }} />
        <span className="font-mono text-xs font-semibold" style={{ color }}>{label}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function ResultPanel({ result, error, lang = 'en' }) {
  const [visible, setVisible] = useState(false);
  const L = LABELS[lang];

  useEffect(() => {
    if (result || error) {
      setVisible(false);
      requestAnimationFrame(() => setVisible(true));
    }
  }, [result, error]);

  if (error) {
    return (
      <div className="terminal-card border-terminal-red/30 animate-fade-in">
        <div className="terminal-card-header">
          <div className="w-1 h-4 rounded bg-terminal-red" />
          <span className="font-mono text-xs font-semibold text-terminal-red">ERROR</span>
        </div>
        <div className="p-5 font-mono text-sm text-terminal-red">{error}</div>
      </div>
    );
  }

  if (!result || !visible) return null;

  const isCodeReview = result.mode === 'code_review';

  if (isCodeReview && result.codeReview) {
    const cr = result.codeReview;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-terminal-dim">{L.code_review_mode}</span>
          <ConfidenceBadge value={result.confidence} lang={lang} />
        </div>
        {cr.problems?.length > 0 && (
          <Section label={L.problems} color="#ff5f5f">
            <ul className="space-y-2">{cr.problems.map((p, i) => (
              <li key={i} className="font-mono text-sm text-terminal-text flex gap-3">
                <span className="text-terminal-red shrink-0">✗</span><span>{p}</span>
              </li>
            ))}</ul>
          </Section>
        )}
        {cr.improvements?.length > 0 && (
          <Section label={L.improvements} color="#ffd700">
            <ul className="space-y-2">{cr.improvements.map((p, i) => (
              <li key={i} className="font-mono text-sm text-terminal-text flex gap-3">
                <span className="text-terminal-yellow shrink-0">→</span><span>{p}</span>
              </li>
            ))}</ul>
          </Section>
        )}
        {cr.performance?.length > 0 && (
          <Section label={L.performance} color="#5ab0ff">
            <ul className="space-y-2">{cr.performance.map((p, i) => (
              <li key={i} className="font-mono text-sm text-terminal-text flex gap-3">
                <span className="text-terminal-blue shrink-0">⚡</span><span>{p}</span>
              </li>
            ))}</ul>
          </Section>
        )}
        {cr.security?.length > 0 && (
          <Section label={L.security} color="#ff6b35">
            <ul className="space-y-2">{cr.security.map((p, i) => (
              <li key={i} className="font-mono text-sm text-terminal-text flex gap-3">
                <span className="text-terminal-accent shrink-0">⚠</span><span>{p}</span>
              </li>
            ))}</ul>
          </Section>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-terminal-dim">{L.analysis_complete}</span>
        <ConfidenceBadge value={result.confidence} lang={lang} />
      </div>

      {result.rootCause && (
        <Section label={L.root_cause} color="#ff5f5f">
          <p className="font-mono text-sm text-terminal-text leading-relaxed">{result.rootCause}</p>
        </Section>
      )}

      {result.errorLocation && (
        <Section label={L.error_location} color="#ffd700">
          <div className="space-y-1">
            {result.errorLocation.file && (
              <div className="flex gap-3">
                <span className="font-mono text-xs text-terminal-dim w-12 shrink-0">{L.file}</span>
                <span className="font-mono text-sm text-terminal-yellow">{result.errorLocation.file}</span>
              </div>
            )}
            {result.errorLocation.details && (
              <div className="flex gap-3">
                <span className="font-mono text-xs text-terminal-dim w-12 shrink-0">{L.info}</span>
                <span className="font-mono text-sm text-terminal-text">{result.errorLocation.details}</span>
              </div>
            )}
          </div>
        </Section>
      )}

      {result.fixSteps?.length > 0 && (
        <Section label={L.fix_steps} color="#7bc67e">
          <ol className="space-y-3">
            {result.fixSteps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-mono text-xs text-terminal-green shrink-0 mt-0.5 w-5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-sm text-terminal-text leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {result.codePatch?.hasPatch && result.codePatch?.diff && (
        <Section label={L.code_patch} color="#5ab0ff">
          <DiffBlock
            diff={result.codePatch.diff}
            language={result.codePatch.language}
            filename={result.codePatch.filename}
          />
        </Section>
      )}
    </div>
  );
}
