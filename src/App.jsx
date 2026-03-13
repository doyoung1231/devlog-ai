import { useState, useEffect } from 'react';
import Header from './components/Header';
import LogInput from './components/LogInput';
import ResultPanel from './components/ResultPanel';
import LoadingState from './components/LoadingState';
import AuthModal from './components/AuthModal';
import HistoryPanel from './components/HistoryPanel';
import { useAnalyze } from './hooks/useAnalyze';
import { useAuth } from './hooks/useAuth';
import { useHistory } from './hooks/useHistory';

const SUPPORTED_PLATFORMS = [
  { label: 'React Native', color: '#61dafb' },
  { label: 'Flutter', color: '#56d1ff' },
  { label: 'iOS / Xcode', color: '#5ab0ff' },
  { label: 'Android', color: '#7bc67e' },
  { label: 'React / Next.js', color: '#ffd700' },
  { label: 'Node / Vite', color: '#ff6b35' },
];

const HERO = {
  en: {
    tag: '▸ DEVLOG AI',
    title: 'Build Error Analyzer',
    desc: 'Paste your build logs, stack traces, or error output.\nGet root cause + fix steps + code patch in seconds.',
    tips: ['Paste 1000+ line logs', 'Or paste just your code for review', 'Platform auto-detected'],
    footer_l: 'DevLog AI v0.1 — Powered by Claude',
    footer_r: 'Built for developers',
    pattern_warning: (n) => `⚠ Similar error detected ${n} time(s) in your history`,
    login_to_save: 'Sign in to save analysis history',
  },
  ko: {
    tag: '▸ DEVLOG AI',
    title: '빌드 에러 분석기',
    desc: '빌드 로그, 스택 트레이스, 에러 메시지를 붙여넣으세요.\n근본 원인 + 수정 단계 + 코드 패치를 즉시 제공합니다.',
    tips: ['1000줄 이상의 로그도 분석 가능', '코드만 붙여넣으면 코드 리뷰 모드', '플랫폼 자동 감지'],
    footer_l: 'DevLog AI v0.1 — Powered by Claude',
    footer_r: '개발자를 위해 만들어졌습니다',
    pattern_warning: (n) => `⚠ 히스토리에서 유사한 에러가 ${n}번 발견됐습니다`,
    login_to_save: '로그인하면 분석 히스토리가 저장됩니다',
  }
};

export default function App() {
  const { analyze, loading, result, error } = useAnalyze();
  const { user, loading: authLoading, signOut } = useAuth();
  const { history, loading: histLoading, saveAnalysis, getPatternCount } = useHistory(user);
  const [lang, setLang] = useState('en');
  const [showAuth, setShowAuth] = useState(false);
  const [detectedPlatform, setDetectedPlatform] = useState(null);
  const [patternCount, setPatternCount] = useState(0);
  const hasResult = result || error;
  const h = HERO[lang];

  const handleAnalyze = (logInput, platform) => {
    setDetectedPlatform(platform);
    setPatternCount(0);
    analyze(logInput, platform);
  };

  useEffect(() => {
    if (result && user) {
      saveAnalysis({ platform: detectedPlatform?.id, logInput: '', result });
      const count = getPatternCount(result.rootCause);
      setPatternCount(count);
    }
  }, [result]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
        <span className="font-mono text-terminal-dim text-sm animate-pulse">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terminal-bg noise-bg">
      <Header
        lang={lang}
        onLangToggle={() => setLang(l => l === 'en' ? 'ko' : 'en')}
        user={user}
        onAuthClick={() => setShowAuth(true)}
        onSignOut={signOut}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {!hasResult && !loading && (
          <div className="mb-10 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-terminal-accent text-xs tracking-widest">{h.tag}</span>
              <span className="h-px flex-1 bg-terminal-border max-w-24" />
            </div>
            <h1 className="font-mono text-3xl sm:text-4xl font-bold text-terminal-text mb-3">{h.title}</h1>
            <p className="font-mono text-terminal-dim text-sm max-w-xl leading-relaxed whitespace-pre-line">{h.desc}</p>
            <div className="flex flex-wrap gap-2 mt-6">
              {SUPPORTED_PLATFORMS.map(p => (
                <span key={p.label} className="font-mono text-xs px-3 py-1 rounded-full border"
                  style={{ color: p.color, borderColor: `${p.color}30`, background: `${p.color}08` }}>
                  {p.label}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className={`${hasResult ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'max-w-3xl mx-auto'}`}>
          <div className="space-y-4">
            <LogInput onAnalyze={handleAnalyze} loading={loading} lang={lang} />

            {patternCount > 0 && result && (
              <div className="px-4 py-3 rounded border border-yellow-500/30 bg-yellow-500/5 font-mono text-xs text-yellow-400">
                {h.pattern_warning(patternCount)}
              </div>
            )}

            {!user && (
              <div
                onClick={() => setShowAuth(true)}
                className="px-4 py-3 rounded border border-terminal-border hover:border-terminal-accent transition-colors cursor-pointer"
              >
                <span className="font-mono text-xs text-terminal-dim hover:text-terminal-accent transition-colors">
                  → {h.login_to_save}
                </span>
              </div>
            )}

            {!hasResult && !loading && (
              <div className="flex flex-wrap gap-4 px-1">
                {h.tips.map((tip, i) => (
                  <div key={i} className="font-mono text-xs text-terminal-dim">
                    <span className="text-terminal-accent">→</span> {tip}
                  </div>
                ))}
              </div>
            )}

            {user && (
              <HistoryPanel
                history={history}
                loading={histLoading}
                lang={lang}
                onSelect={() => { }}
              />
            )}
          </div>

          <div>
            {loading && <LoadingState lang={lang} />}
            {!loading && (result || error) && (
              <ResultPanel result={result} error={error} lang={lang} />
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-terminal-border mt-20 py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="font-mono text-xs text-terminal-dim">{h.footer_l}</span>
          <span className="font-mono text-xs text-terminal-dim">{h.footer_r}</span>
        </div>
      </footer>

      {showAuth && <AuthModal lang={lang} onClose={() => setShowAuth(false)} />}
    </div>
  );
}