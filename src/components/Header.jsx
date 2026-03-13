export default function Header({ lang, onLangToggle, user, onAuthClick, onSignOut }) {
  const t = lang === 'ko'
    ? { subtitle: '빌드 에러 분석기', api: 'API 연결됨', login: '로그인', logout: '로그아웃' }
    : { subtitle: 'Build Error Analyzer', api: 'API Connected', login: 'Sign In', logout: 'Sign Out' };

  return (
    <header className="border-b border-terminal-border bg-terminal-surface/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="w-8 h-8 rounded bg-terminal-accent flex items-center justify-center">
            <span className="font-mono text-xs font-bold text-white">D</span>
          </div>
          <div>
            <span className="font-mono font-bold text-terminal-text tracking-tight">DevLog</span>
            <span className="font-mono font-bold text-terminal-accent tracking-tight"> AI</span>
          </div>
          <span className="ml-2 text-xs font-mono px-2 py-0.5 rounded bg-terminal-border text-terminal-dim">v0.1</span>
        </button>

        <nav className="flex items-center gap-3">
          <span className="text-terminal-dim text-sm font-mono hidden sm:block">{t.subtitle}</span>

          {/* 언어 토글 */}
          <button
            onClick={onLangToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-terminal-border hover:border-terminal-accent transition-colors font-mono text-xs text-terminal-dim hover:text-terminal-accent"
          >
            {lang === 'ko' ? '🇰🇷 KO' : '🇺🇸 EN'}
          </button>

          {/* 로그인 / 유저 */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-terminal-dim hidden sm:block truncate max-w-32">
                {user.email}
              </span>
              <button
                onClick={onSignOut}
                className="px-3 py-1.5 rounded border border-terminal-border hover:border-terminal-red transition-colors font-mono text-xs text-terminal-dim hover:text-terminal-red"
              >
                {t.logout}
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="px-4 py-1.5 rounded bg-terminal-accent text-white font-mono text-xs hover:bg-orange-500 transition-colors"
            >
              {t.login}
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse-slow" />
            <span className="text-xs font-mono text-terminal-dim hidden sm:block">{t.api}</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
