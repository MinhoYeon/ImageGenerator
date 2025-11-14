# 배포 전후 체크리스트

## 🔒 보안 체크리스트

### 배포 전 필수 체크

- [x] **.env 파일이 .gitignore에 포함되어 있는가?**
  - 현재 상태: ✅ `.env*`가 .gitignore에 포함됨
  - API 키나 시크릿이 없으므로 안전

- [x] **민감한 정보가 코드에 하드코딩되어 있지 않은가?**
  - 현재 상태: ✅ 모든 설정이 클라이언트 사이드에서 처리됨
  - API 키, 비밀번호, 토큰 없음

- [x] **의존성 보안 취약점이 없는가?**
  ```bash
  npm audit
  ```
  - 현재 상태: ✅ 0 vulnerabilities

- [ ] **HTTPS가 활성화되어 있는가?**
  - Vercel/Netlify: 자동으로 HTTPS 제공 ✅
  - GitHub Pages: Settings에서 "Enforce HTTPS" 체크 필요

### 선택 사항

- [ ] **Content Security Policy (CSP) 설정**
  ```typescript
  // next.config.ts에 추가
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ]
  }
  ```

- [ ] **X-Frame-Options 설정** (클릭재킹 방지)
  ```typescript
  // next.config.ts headers에 추가
  { key: 'X-Frame-Options', value: 'DENY' }
  ```

---

## 💰 비용 체크리스트

### Vercel 무료 티어 제한

- ✅ **대역폭**: 100GB/월
  - 현재 앱: 정적 사이트, 매우 작은 번들
  - 예상 사용량: 일반적으로 문제 없음

- ✅ **빌드 시간**: 100시간/월
  - 현재 빌드 시간: ~1-2분
  - 매일 10번 배포해도 문제 없음

- ✅ **함수 실행**: 100GB-시간/월
  - 현재 상태: 정적 사이트, 서버리스 함수 없음
  - 사용량: 0

- ✅ **이미지 최적화**: 1,000장/월
  - 현재 상태: `unoptimized: true` 설정으로 사용 안 함
  - 사용량: 0

### Netlify 무료 티어 제한

- ✅ **대역폭**: 100GB/월
- ✅ **빌드 시간**: 300분/월
- ✅ **동시 빌드**: 1개

### GitHub Pages 제한

- ✅ **저장소 크기**: 1GB (권장)
  - 현재 상태: 매우 작음 (<10MB)

- ✅ **대역폭**: 100GB/월 (소프트 제한)
- ✅ **빌드 시간**: 10분/빌드

### 비용 모니터링 방법

**Vercel:**
1. Dashboard → Usage
2. Bandwidth, Build Time 확인

**Netlify:**
1. Team settings → Usage and billing
2. Build minutes, Bandwidth 확인

**GitHub Pages:**
- GitHub Settings → Pages
- 별도 모니터링 도구 없음, 트래픽이 많으면 알림

---

## 📊 성능 체크리스트

### 배포 전

- [ ] **빌드 크기 확인**
  ```bash
  npm run build
  # .next 또는 out 폴더 크기 확인
  du -sh out/
  ```
  - 목표: < 5MB

- [ ] **불필요한 의존성 제거**
  ```bash
  npm prune
  npx depcheck
  ```

- [ ] **이미지 최적화**
  - 현재 상태: ✅ Canvas로 동적 생성, 추가 이미지 없음

### 배포 후

- [ ] **로딩 속도 확인**
  - https://pagespeed.web.dev/ 에서 테스트
  - 목표: Performance 점수 > 90

- [ ] **모바일 반응형 테스트**
  - Chrome DevTools → 디바이스 모드
  - 다양한 화면 크기 확인

- [ ] **브라우저 호환성 확인**
  - Chrome, Firefox, Safari, Edge 테스트
  - Canvas API 지원 확인

---

## 🚨 중요 주의사항

### 현재 프로젝트 특성

✅ **장점:**
- 완전한 클라이언트 사이드 애플리케이션
- 서버 API 없음 → 서버 비용 0
- 데이터베이스 없음 → DB 비용 0
- 외부 API 호출 없음 → API 비용 0
- 모든 처리가 브라우저에서 발생 → 보안 위험 최소화

⚠️ **주의사항:**
- 대용량 트래픽 시 대역폭 초과 가능
  - 해결책: CDN 캐싱 활성화 (Vercel/Netlify 자동)

- Canvas 렌더링은 클라이언트 리소스 사용
  - 해결책: 현재 코드 최적화 충분

### 비용 초과 방지

**알림 설정하기:**

**Vercel:**
```
Settings → Usage Alerts →
- Bandwidth 알림: 80GB (80%)
- Build Time 알림: 80시간 (80%)
```

**Netlify:**
```
Team settings → Usage and billing →
- Set up usage alerts
```

---

## ✅ 최종 체크리스트

### 배포 직전
- [ ] `npm run build` 성공 확인
- [ ] 로컬에서 `npx serve out` 테스트
- [ ] .gitignore 확인
- [ ] README.md 업데이트 (배포 URL 추가)

### 배포 직후
- [ ] 배포된 사이트 접속 확인
- [ ] 모든 기능 테스트 (이름 입력, 도장 생성, 다운로드)
- [ ] 모바일에서 테스트
- [ ] 404 에러 페이지 확인

### 정기 점검 (월 1회)
- [ ] 의존성 업데이트: `npm outdated`
- [ ] 보안 취약점 확인: `npm audit`
- [ ] 사용량 모니터링 (대역폭, 빌드 시간)

---

## 🆘 문제 발생 시

### 무료 티어 초과 시
1. **캐싱 최적화**
   - Vercel/Netlify는 자동 CDN 캐싱
   - Cache-Control 헤더 확인

2. **티어 업그레이드 고려**
   - Vercel Pro: $20/월
   - Netlify Pro: $19/월

3. **대안 플랫폼 이동**
   - Cloudflare Pages (무료 무제한)
   - AWS S3 + CloudFront

### 보안 이슈 발생 시
1. 즉시 배포 중단
2. 문제 원인 파악
3. 코드 수정 후 재배포
4. 의존성 업데이트: `npm update`
