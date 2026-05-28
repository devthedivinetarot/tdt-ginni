# Worktree Documentation - The Divine Tarot

## REQUIRED PAGES

| Page | Status | Path |
|------|--------|------|
| / | KEEP | app/page.tsx |
| /reading | KEEP | app/reading/page.tsx |
| /premium | KEEP | app/premium/page.tsx |
| /yesno | KEEP | app/yesno/page.tsx |
| /about | KEEP | app/about/page.tsx |
| /contact | KEEP | app/contact/page.tsx |

## REQUIRED FOLDERS

| Folder | Status | Description |
|--------|--------|-------------|
| `/src` | KEEP | Core source code |
| `/src/components` | KEEP | React components |
| `/src/hooks` | KEEP | Custom React hooks |
| `/src/lib` | KEEP | Utilities and business logic |
| `/src/store` | KEEP | Zustand stores |
| `/public` | KEEP | Static assets |
| `/app` | KEEP | Next.js App Router |

## REQUIRED FILES

### Core Configuration
| File | Status |
|------|--------|
| package.json | KEEP |
| next.config.js | KEEP |
| tsconfig.json | KEEP |
| tailwind.config.ts | KEEP |
| .env.example | KEEP |

### App Router Structure
| File | Status |
|------|--------|
| app/layout.tsx | KEEP |
| app/client-layout.tsx | KEEP |
| app/globals.css | KEEP |
| app/page.tsx | KEEP |

### API Routes
| File | Status |
|------|--------|
| app/api/premium-order/route.ts | KEEP |
| app/api/subscription/webhook/route.ts | KEEP |
| app/api/subscribe/route.ts | KEEP |

### Components (Essential)
| File | Status |
|------|--------|
| src/components/subscription/PremiumModal.tsx | KEEP |
| src/components/layout/Header.tsx | KEEP |
| src/components/layout/Footer.tsx | KEEP |
| src/components/layout/Hero.tsx | KEEP |
| src/components/ClientProviders.tsx | KEEP |

### Hooks (Essential)
| File | Status |
|------|--------|
| src/hooks/useSubscription.ts | KEEP |
| src/hooks/useDailyMessageLimit.ts | KEEP |
| src/hooks/useUser.ts | KEEP |

### Library (Essential)
| File | Status |
|------|--------|
| src/lib/payments/plans.ts | KEEP |
| src/lib/subscription/checkAccess.ts | KEEP |
| src/lib/supabase/client.ts | KEEP |
| src/lib/supabase/server.ts | KEEP |

## FILES TO REMOVE

### Temporary/Build Files
- check_swc.js
- build_final.txt, build.txt, build_result.txt, build_out.txt, build_output.txt
- build_log3.txt, build_log2.txt, build_log.txt
- typeerrors.txt
- test.txt, test.js
- temp.txt
- error.txt
- tail.txt
- fixBrace.js, fixBrace2.js
- CheckBrace.js, CheckBrace2.js, CheckBrace3.js, CheckBrace4.js
- Tail.js
- kill3000.ps1, kill3000-loop.ps1, start3000.ps1, force-kill-port.ps1, kill-port.ps1

### Duplicate/Migration Docs
- AUDIT_REPORT_COMPREHENSIVE.md
- audit_report.md
- TRANSFORMATION_SUMMARY.md
- IMPLEMENTATION_COMPLETE.md
- IMPLEMENTATION_SUMMARY.md
- SYSTEM_RESILIENCE.md
- ENV_STRATEGY.md
- ENV_KEYS.md
- I18N_SYSTEM.md
- FOOTER_DEMO.html

### Unused Assets
- public/tdt-v3/* (keep only if actively used)
- build_*.txt files
- before_*.txt files
- clean_*.txt files

### Unused API Routes
- app/api/agent/route.ts (not integrated)
- app/api/optimize/route.ts (not integrated)
- app/api/log/route.ts (not needed)
- app/api/translate/route.ts (not integrated)
- app/api/admin/translations/route.ts (unused)
- app/api/translations/route.ts (unused)
- app/api/booking/route.ts (unused)
- app/api/personalization/route.ts (unused)
- app/api/automation/route.ts (unused)
- app/api/tracking/route.ts (unused)
- app/api/events/route.ts (unused)
- app/api/track/route.ts (unused)
- app/api/payments/route.ts (duplicate, keep webhook)
- app/api/seo/programmatic/route.ts (unused)
- app/api/horoscope/route.ts (unused)
- app/api/social/video/route.ts (unused)
- app/api/blog/content/route.ts (unused)
- app/api/cron/messages/route.ts (unused)
- app/api/whatsapp/* (unused)

## FILES TO REFACTOR

| File | Issue |
|------|-------|
| app/premium/page.tsx | Missing return type on icons, invalid TypeScript |
| app/reading/page.tsx | Missing Head import (React 18), client 'use client' in checkAccess |
| src/hooks/useSubscription.ts | Client-side only logic, needs server validation |
| src/lib/subscription/checkAccess.ts | Has 'use client' directive but used by server |
| next.config.js | Missing images config |
| package.json | Svelte in devDependencies (unused) |
| src/components/subscription/PremiumModal.tsx | Complex but functional, needs minor cleanup |

## CLASSIFICATION SUMMARY

- **KEEP**: 45 files (core application)
- **REMOVE**: 35+ files (temporary, duplicate, unused)
- **REFACTOR**: 6 files (logic issues, TypeScript fixes)