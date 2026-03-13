import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

export function useHistory(user) {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchHistory = async () => {
        if (!user) return
        setLoading(true)
        const { data } = await supabase
            .from('analyses')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20)
        setHistory(data || [])
        setLoading(false)
    }

    useEffect(() => {
        fetchHistory()
    }, [user])

    const saveAnalysis = async ({ platform, logInput, result }) => {
        if (!user) return
        await supabase.from('analyses').insert({
            user_id: user.id,
            platform,
            log_input: logInput,
            root_cause: result.rootCause,
            fix_steps: result.fixSteps,
            code_patch: result.codePatch,
            confidence: result.confidence,
            mode: result.mode,
        })
        fetchHistory()
    }

    const getPatternCount = (rootCause) => {
        if (!rootCause) return 0
        const keywords = rootCause.toLowerCase().split(' ').slice(0, 5)
        return history.filter(h =>
            h.root_cause && keywords.some(k => k.length > 4 && h.root_cause.toLowerCase().includes(k))
        ).length
    }

    return { history, loading, saveAnalysis, getPatternCount, fetchHistory }
}