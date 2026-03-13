DevLog AI

AI 기반 빌드 에러 분석기 — 로그를 붙여넣으면 근본 원인 + 수정 단계 + 코드 패치를 즉시 제공합니다.

소개
DevLog AI는 모바일 및 웹 프로젝트의 빌드 로그, 스택 트레이스, 에러 메시지를 분석합니다. Anthropic Claude API를 통해 근본 원인을 파악하고, 단계별 수정 방법과 코드 패치를 제공합니다.
지원 플랫폼: React Native · Flutter · iOS / Xcode · Android · React / Next.js · Node / Vite

주요 기능

에러 분석 모드 — 빌드 로그나 스택 트레이스를 붙여넣으면 근본 원인, 에러 위치, 수정 단계, diff 형식의 코드 패치를 제공
코드 리뷰 모드 — 에러 없이 코드만 붙여넣으면 문제점, 개선 제안, 성능 및 보안 피드백 제공
플랫폼 자동 감지 — 로그 내용을 기반으로 플랫폼 자동 판별
신뢰도 점수 — 분석 결과에 0–100 신뢰도 표시
분석 히스토리 — 로그인 시 이전 분석 기록 저장 및 조회 (Supabase)
유사 에러 경고 — 히스토리에 비슷한 에러가 있으면 알림
한국어 / 영어 UI 전환 지원


기술 스택
영역기술프론트엔드React 18, Vite, Tailwind CSS백엔드Node.js, ExpressAIAnthropic Claude (claude-sonnet-4-6)인증 & DBSupabase (Google OAuth + 이메일/비밀번호)

시작하기
사전 요구사항

Node.js 18+
Anthropic API 키
Supabase 프로젝트 (히스토리 및 인증용)

설치
bashgit clone https://github.com/your-username/devlog-ai.git
cd devlog-ai
npm install
환경변수 설정
.env.example을 복사해 .env를 만들고 값을 채워주세요:
bashcp .env.example .env
env# Anthropic API 키 (필수)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# 서버 포트 (선택, 기본값 3001)
PORT=3001

# Supabase 키는 Supabase 대시보드 → Project Settings → API에서 확인
실행
bash# 프론트엔드 + 백엔드 동시 실행
npm run dev:all

# 개별 실행
npm run dev          # Vite 프론트엔드 → http://localhost:3000
npm run dev:server   # Express 백엔드 → http://localhost:3001
프로덕션 빌드
bashnpm run build   # 프론트엔드 빌드
npm start       # Express 서버 실행

프로젝트 구조
devlog-ai/
├── src/
│   ├── components/   # Header, LogInput, ResultPanel, LoadingState, AuthModal, HistoryPanel
│   ├── hooks/        # useAnalyze, useAuth, useHistory
│   └── App.jsx       # 메인 앱
├── server.js         # Express API 서버 (/api/analyze, /api/health)
├── vite.config.js    # Vite 설정 + 백엔드 프록시
├── .env.example      # 환경변수 템플릿
└── index.html

API
POST /api/analyze
빌드 로그 또는 코드를 분석합니다.
요청:
json{
  "log": "붙여넣을 로그 또는 코드",
  "lang": "ios"
}
응답 예시 (에러 분석):
json{
  "rootCause": "...",
  "errorLocation": { "file": "...", "details": "..." },
  "fixSteps": ["Step 1: ...", "Step 2: ..."],
  "codePatch": { "hasPatch": true, "language": "ruby", "filename": "ios/Podfile", "diff": "- ...\n+ ..." },
  "confidence": 91,
  "mode": "error_analysis",
  "codeReview": null
}
GET /api/health
백엔드 상태 확인. { "status": "ok" } 반환.

DevLog AI v0.1 — Powered by Claude · 개발자를 위해 만들어졌습니다공유콘텐츠import { useState, useEffect } from 'react';
import Header from './components/Header';
import LogInput from './components/LogInput';
import ResultPanel from './components/ResultPanel';
import LoadingState from './components/LoadingState';
import AuthModal from './components/AuthModal';
import Historpasted
