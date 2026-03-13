import { useState, useEffect, useRef } from 'react';
import { detectLanguage } from '../utils/detectLanguage';

const PLACEHOLDERS = {
  en: `> Paste your build log here...

e.g.
FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:mergeDebugResources'.`,
  ko: `> 빌드 로그를 붙여넣으세요...

예시)
FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:mergeDebugResources'.`
};

const UI = {
  en: { clear: '[clear]', shortcut: '⌘ + Enter to analyze', btn: 'Analyze Log', analyzing: 'Analyzing...' },
  ko: { clear: '[초기화]', shortcut: '⌘ + Enter로 분석', btn: '분석하기', analyzing: '분석 중...' },
};

export default function LogInput({ onAnalyze, loading, lang = 'en' }) {
  const [value, setValue] = useState('');
  const [detectedLang, setDetectedLang] = useState(null);
  const textareaRef = useRef(null);
  const ui = UI[lang];

  useEffect(() => {
    if (value.trim().length > 20) {
      setDetectedLang(detectLanguage(value));
    } else {
      setDetectedLang(null);
    }
  }, [value]);

  const handleSubmit = () => {
    if (!value.trim() || loading) return;
    onAnalyze(value, detectedLang);
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="terminal-card glow-accent">
      <div className="terminal-card-header justify-between">
        <div className="flex items-center gap-2">
          <div className="dot bg-red-500" />
          <div className="dot bg-yellow-500" />
          <div className="dot bg-green-500" />
          <span className="ml-2 font-mono text-xs text-terminal-dim">log_input.txt</span>
        </div>
        <div className="flex items-center gap-4">
          {detectedLang && detectedLang.id !== 'unknown' && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-terminal-border">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: detectedLang.color }} />
              <span className="font-mono text-xs" style={{ color: detectedLang.color }}>{detectedLang.label}</span>
            </div>
          )}
          <span className="font-mono text-xs text-terminal-dim">
            {value.split('\n').length}L · {value.length}C
          </span>
        </div>
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDERS[lang]}
          className="w-full h-72 bg-transparent font-mono text-sm text-terminal-text px-6 py-5 placeholder:text-terminal-muted/50 leading-relaxed"
          spellCheck={false}
        />
        {loading && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-b-lg">
            <div className="scanline" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-terminal-border">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setValue('')}
            disabled={!value || loading}
            className="font-mono text-xs text-terminal-dim hover:text-terminal-text transition-colors disabled:opacity-30"
          >
            {ui.clear}
          </button>
          <span className="font-mono text-xs text-terminal-dim hidden sm:block">{ui.shortcut}</span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!value.trim() || loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded bg-terminal-accent text-white font-mono text-sm font-medium hover:bg-orange-500 active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {ui.analyzing}
            </>
          ) : (
            <><span>▶</span> {ui.btn}</>
          )}
        </button>
      </div>
    </div>
  );
}
