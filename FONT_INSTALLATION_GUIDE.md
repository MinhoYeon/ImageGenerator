# 폰트 파일 설치 가이드

프로젝트가 로컬 한글 폰트 파일을 사용하도록 구성되었습니다.
이제 **궁서체**와 **바탕체** 폰트 파일을 추가해야 합니다.

## 필요한 폰트 파일

다음 2개의 폰트 파일이 필요합니다:

1. **궁서체 (Gungseo)** - OTF 또는 TTF 형식
2. **바탕체 (Batang)** - OTF 또는 TTF 형식

## 파일 형식

- **OTF (OpenType Font)** - ✅ 권장 (더 많은 기능, 한글 폰트에 적합)
- **TTF (TrueType Font)** - ✅ 가능 (호환성 좋음)

두 형식 모두 작동하지만, 한글 폰트의 경우 **OTF를 권장**합니다.

## 설치 방법

### 옵션 1: 파일을 직접 복사

1. 폰트 파일의 이름을 다음과 같이 변경합니다:
   - 궁서체 파일 → `gungseo.otf` (또는 `gungseo.ttf`)
   - 바탕체 파일 → `batang.otf` (또는 `batang.ttf`)

2. 파일을 다음 경로에 복사합니다:
   ```
   /home/user/ImageGenerator/app/fonts/
   ```

3. 최종 파일 구조:
   ```
   ImageGenerator/
   └── app/
       └── fonts/
           ├── gungseo.otf
           └── batang.otf
   ```

### 옵션 2: TTF 파일을 사용하는 경우

TTF 파일을 사용한다면 `app/layout.tsx`의 설정을 수정해야 합니다:

```typescript
// app/layout.tsx에서
const gungseoFont = localFont({
  src: './fonts/gungseo.ttf',  // .otf를 .ttf로 변경
  variable: '--font-gungseo',
  weight: '400 700 900',
  display: 'swap',
  fallback: ['Gungsuh', 'Gungseo', '궁서', 'serif'],
});

const batangFont = localFont({
  src: './fonts/batang.ttf',  // .otf를 .ttf로 변경
  variable: '--font-batang',
  weight: '400 700 900',
  display: 'swap',
  fallback: ['Batang', '바탕', 'serif'],
});
```

## 폰트 파일 제공 방법

다음 중 하나의 방법으로 폰트 파일을 제공해주세요:

### 방법 1: 파일 경로 알려주기
폰트 파일이 저장된 경로를 알려주세요.
```
예: C:\Users\minho\Downloads\폰트\궁서체.otf
```

### 방법 2: 폰트 이름 알려주기
사용할 정확한 폰트 이름을 알려주세요.
```
예: "HY견명조", "윤명조", "한컴 바탕" 등
```

### 방법 3: 직접 파일 추가
프로젝트의 `app/fonts/` 폴더에 직접 파일을 추가하신 후 알려주세요.

## 설치 후 확인

1. 터미널에서 다음 명령어로 파일이 제대로 추가되었는지 확인:
   ```bash
   ls -la /home/user/ImageGenerator/app/fonts/
   ```

2. 예상 출력:
   ```
   total 1024
   drwxr-xr-x 2 root root    4096 Nov 15 02:22 .
   drwxr-xr-x 5 root root    4096 Nov 15 02:22 ..
   -rw-r--r-- 1 root root  512000 Nov 15 02:22 gungseo.otf
   -rw-r--r-- 1 root root  512000 Nov 15 02:22 batang.otf
   ```

3. 개발 서버 재시작:
   ```bash
   npm run dev
   ```

4. 브라우저에서 `http://localhost:3000` 접속하여 폰트가 제대로 렌더링되는지 확인

## 문제 해결

### 폰트가 표시되지 않는 경우

1. **파일 이름 확인**
   - `gungseo.otf` 또는 `gungseo.ttf` (정확히 이름이 일치해야 함)
   - `batang.otf` 또는 `batang.ttf`

2. **파일 경로 확인**
   - 파일이 `app/fonts/` 폴더에 있는지 확인
   - 폴더 구조: `app/fonts/gungseo.otf`

3. **파일 권한 확인**
   ```bash
   chmod 644 /home/user/ImageGenerator/app/fonts/*.otf
   ```

4. **개발 서버 재시작**
   - `Ctrl+C`로 서버 중단 후 `npm run dev`로 재시작

5. **브라우저 캐시 삭제**
   - Chrome: `Ctrl+Shift+R` (강력 새로고침)
   - 개발자 도구 → Network 탭 → "Disable cache" 체크

### 빌드 에러가 발생하는 경우

1. **파일 형식 확인**
   - OTF/TTF 파일이 손상되지 않았는지 확인
   - 다른 폰트 파일로 시도

2. **layout.tsx 설정 확인**
   - `src: './fonts/gungseo.otf'` 경로가 정확한지 확인
   - OTF와 TTF가 혼용되지 않았는지 확인

## 추천 무료 한글 폰트

시스템에 폰트가 없다면 다음 무료 폰트를 사용할 수 있습니다:

### 궁서체 대체:
- **Nanum Myeongjo (나눔명조)** - [네이버](https://hangeul.naver.com/font)
- **Noto Serif CJK KR** - [Google Fonts](https://fonts.google.com/noto/specimen/Noto+Serif+KR)

### 바탕체 대체:
- **Noto Serif KR** - [Google Fonts](https://fonts.google.com/noto/specimen/Noto+Serif+KR)
- **KoPub Batang (한국출판바탕)** - [한국출판인회의](https://www.kopus.org/biz/electronic/font.aspx)

## 다음 단계

폰트 파일을 추가한 후:
1. 개발 서버 재시작
2. 브라우저에서 도장 생성 테스트
3. 모바일에서도 테스트
4. 문제없으면 빌드 후 배포

---

**현재 상태:**
- ✅ `app/fonts/` 디렉토리 생성 완료
- ✅ `app/layout.tsx` 로컬 폰트 설정 완료
- ✅ `app/page.tsx` 폰트 매핑 업데이트 완료
- ⏳ 폰트 파일 추가 대기 중

**필요한 작업:**
폰트 파일 2개를 `app/fonts/` 폴더에 추가하고 알려주세요!
