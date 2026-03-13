import { useState } from 'react'
import { supabase } from '../utils/supabase'

const UI = {
    en: {
        login: 'Sign In',
        signup: 'Sign Up',
        email: 'Email',
        password: 'Password',
        google: 'Continue with Google',
        no_account: "Don't have an account?",
        have_account: 'Already have an account?',
        switch_signup: 'Sign up',
        switch_login: 'Sign in',
        close: '[close]',
        email_sent: '✓ Check your email to confirm signup',
    },
    ko: {
        login: '로그인',
        signup: '회원가입',
        email: '이메일',
        password: '비밀번호',
        google: 'Google로 계속하기',
        no_account: '계정이 없으신가요?',
        have_account: '이미 계정이 있으신가요?',
        switch_signup: '회원가입',
        switch_login: '로그인',
        close: '[닫기]',
        email_sent: '✓ 이메일을 확인해 가입을 완료하세요',
    }
}

export default function AuthModal({ lang = 'en', onClose }) {
    const [mode, setMode] = useState('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const t = UI[lang]

    const handleSubmit = async () => {
        if (!email || !password) return
        setSubmitting(true)
        setError('')
        setMessage('')

        if (mode === 'login') {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) setError(error.message)
            else onClose()
        } else {
            const { error } = await supabase.auth.signUp({ email, password })
            if (error) setError(error.message)
            else setMessage(t.email_sent)
        }
        setSubmitting(false)
    }

    const handleGoogle = async () => {
        setError('')
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
        if (error) setError(error.message)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="terminal-card w-full max-w-md mx-4 animate-slide-up">
                <div className="terminal-card-header justify-between">
                    <div className="flex items-center gap-2">
                        <div className="dot bg-red-500" />
                        <div className="dot bg-yellow-500" />
                        <div className="dot bg-green-500" />
                        <span className="ml-2 font-mono text-xs text-terminal-dim">
                            {mode === 'login' ? t.login : t.signup}
                        </span>
                    </div>
                    <button onClick={onClose} className="font-mono text-xs text-terminal-dim hover:text-terminal-text transition-colors">
                        {t.close}
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <button
                        onClick={handleGoogle}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded border border-terminal-border hover:border-terminal-accent transition-colors font-mono text-sm text-terminal-text"
                    >
                        <svg width="18" height="18" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                            <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                        </svg>
                        {t.google}
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-terminal-border" />
                        <span className="font-mono text-xs text-terminal-dim">or</span>
                        <div className="flex-1 h-px bg-terminal-border" />
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="font-mono text-xs text-terminal-dim block mb-1.5">{t.email}</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                                className="w-full bg-terminal-bg border border-terminal-border rounded px-4 py-2.5 font-mono text-sm text-terminal-text focus:border-terminal-accent outline-none transition-colors"
                                placeholder="dev@example.com"
                            />
                        </div>
                        <div>
                            <label className="font-mono text-xs text-terminal-dim block mb-1.5">{t.password}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                                className="w-full bg-terminal-bg border border-terminal-border rounded px-4 py-2.5 font-mono text-sm text-terminal-text focus:border-terminal-accent outline-none transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && <p className="font-mono text-xs text-terminal-red">{error}</p>}
                    {message && <p className="font-mono text-xs text-terminal-green">{message}</p>}

                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !email || !password}
                        className="w-full py-3 rounded bg-terminal-accent text-white font-mono text-sm font-medium hover:bg-orange-500 transition-colors disabled:opacity-40"
                    >
                        {submitting ? '...' : mode === 'login' ? t.login : t.signup}
                    </button>

                    <p className="text-center font-mono text-xs text-terminal-dim">
                        {mode === 'login' ? t.no_account : t.have_account}{' '}
                        <button
                            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage('') }}
                            className="text-terminal-accent hover:underline"
                        >
                            {mode === 'login' ? t.switch_signup : t.switch_login}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
