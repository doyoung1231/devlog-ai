import { useState } from 'react'

const LABELS = {
    en: {
        title: 'Analysis History',
        empty: 'No analyses yet',
        empty_sub: 'Your history will appear here',
        share: 'Copy Link',
        copied: 'Copied!',
        pattern: 'times',
    },
    ko: {
        title: '분석 히스토리',
        empty: '분석 기록이 없습니다',
        empty_sub: '분석하면 여기에 기록이 쌓입니다',
        share: '링크 복사',
        copied: '복사됨!',
        pattern: '번',
    }
}

function timeAgo(dateStr, lang) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(mins / 60)
    const days = Math.floor(hours / 24)
    if (lang === 'ko') {
        if (mins < 1) return '방금'
        if (mins < 60) return `${mins}분 전`
        if (hours < 24) return `${hours}시간 전`
        return `${days}일 전`
    }
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
}

const platformColor = (p) => {
    const map = { android: '#7bc67e', ios: '#5ab0ff', flutter: '#56d1ff', 'react-native': '#61dafb', web: '#ffd700' }
    return map[p] || '#8892a4'
}

export default function HistoryPanel({ history, loading, lang = 'en', onSelect }) {
    const [copiedId, setCopiedId] = useState(null)
    const L = LABELS[lang]

    const handleCopyLink = (e, shareId) => {
        e.stopPropagation()
        const url = `${window.location.origin}?share=${shareId}`
        navigator.clipboard.writeText(url)
        setCopiedId(shareId)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <div className="terminal-card">
            <div className="terminal-card-header">
                <div className="w-1 h-4 rounded bg-terminal-accent" />
                <span className="font-mono text-xs font-semibold text-terminal-accent">{L.title}</span>
                {loading && <span className="ml-auto font-mono text-xs text-terminal-dim animate-pulse">...</span>}
            </div>

            <div className="divide-y divide-terminal-border">
                {history.length === 0 ? (
                    <div className="p-6 text-center">
                        <p className="font-mono text-sm text-terminal-dim">{L.empty}</p>
                        <p className="font-mono text-xs text-terminal-muted mt-1">{L.empty_sub}</p>
                    </div>
                ) : (
                    history.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => onSelect(item)}
                            className="px-4 py-3 hover:bg-terminal-border/30 cursor-pointer transition-colors group"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                    {item.platform && (
                                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: platformColor(item.platform) }} />
                                    )}
                                    <span className="font-mono text-xs text-terminal-dim shrink-0">{timeAgo(item.created_at, lang)}</span>
                                    <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-terminal-border text-terminal-dim shrink-0">
                                        {item.confidence}%
                                    </span>
                                    <p className="font-mono text-xs text-terminal-text truncate">
                                        {item.root_cause?.slice(0, 50)}...
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => handleCopyLink(e, item.share_id)}
                                    className="shrink-0 font-mono text-xs px-2 py-1 rounded border border-terminal-border opacity-0 group-hover:opacity-100 transition-all hover:border-terminal-accent hover:text-terminal-accent text-terminal-dim"
                                >
                                    {copiedId === item.share_id ? L.copied : L.share}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}