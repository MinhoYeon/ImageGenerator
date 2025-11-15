# 폰트 파일 추가 가이드

## 필요한 폰트 파일 (5개)

다음 폰트 파일들을 `app/fonts/` 디렉토리에 추가해야 합니다:

1. **MuseumClassicB.otf** (또는 .ttf) - 국립박물관문화재단클래식B (기본 폰트)
2. **gungseo.otf** (또는 .ttf) - 궁서체
3. **batang.otf** (또는 .ttf) - 바탕체
4. **dotum.otf** (또는 .ttf) - 돋움체
5. **myeongjo.otf** (또는 .ttf) - 명조체

## 파일 추가 방법

### 1. 로컬에서 폰트 파일 복사

```bash
# 폰트 파일이 있는 위치에서
cp MuseumClassicB.otf /home/user/ImageGenerator/app/fonts/
cp gungseo.otf /home/user/ImageGenerator/app/fonts/
cp batang.otf /home/user/ImageGenerator/app/fonts/
cp dotum.otf /home/user/ImageGenerator/app/fonts/
cp myeongjo.otf /home/user/ImageGenerator/app/fonts/
```

### 2. Git에 추가하고 커밋

```bash
cd /home/user/ImageGenerator
git add app/fonts/*.otf
git commit -m "Add Korean font files for stamp generator"
git push -u origin claude/stamp-image-generator-01WTybd59RoMRrkQfpyEYP4X
```

### 3. TTF 파일을 사용하는 경우

TTF 파일을 사용한다면 `app/layout.tsx`를 수정해야 합니다:

```typescript
// app/layout.tsx에서 각 폰트의 src를 .otf에서 .ttf로 변경
const museumClassicFont = localFont({
  src: './fonts/MuseumClassicB.ttf',  // .otf → .ttf
  // ...
});
```

## 폰트 파일명 규칙

**정확한 파일명**을 사용해야 합니다:
- ✅ `MuseumClassicB.otf` - 정확
- ❌ `museum_classic_b.otf` - 잘못됨
- ❌ `MuseumClassic.otf` - 잘못됨

현재 설정된 파일명:
```
app/fonts/
├── MuseumClassicB.otf   (기본)
├── gungseo.otf
├── batang.otf
├── dotum.otf
└── myeongjo.otf
```

## 폰트를 찾을 수 없는 경우

### 무료 한글 폰트 추천

#### 1. 국립박물관문화재단클래식B 대체
- **Noto Serif KR** - [Google Fonts](https://fonts.google.com/noto/specimen/Noto+Serif+KR)
- **KoPub 바탕** - [한국출판인회의](https://www.kopus.org/biz/electronic/font.aspx)

#### 2. 궁서체 대체
- **Nanum Myeongjo** - [네이버 한글](https://hangeul.naver.com/font)
- **Noto Serif KR** - [Google Fonts](https://fonts.google.com/noto/specimen/Noto+Serif+KR)

#### 3. 바탕체 대체
- **Noto Serif KR** - [Google Fonts](https://fonts.google.com/noto/specimen/Noto+Serif+KR)
- **KoPub 바탕** - [한국출판인회의](https://www.kopus.org/biz/electronic/font.aspx)

#### 4. 돋움체 대체
- **Noto Sans KR** - [Google Fonts](https://fonts.google.com/noto/specimen/Noto+Sans+KR)
- **Nanum Gothic** - [네이버 한글](https://hangeul.naver.com/font)

#### 5. 명조체 대체
- **Noto Serif KR** - [Google Fonts](https://fonts.google.com/noto/specimen/Noto+Serif+KR)
- **Nanum Myeongjo** - [네이버 한글](https://hangeul.naver.com/font)

## 폰트 추가 확인

폰트를 추가한 후:

```bash
# 1. 파일 확인
ls -lah /home/user/ImageGenerator/app/fonts/

# 2. 개발 서버 실행
npm run dev

# 3. 브라우저에서 http://localhost:3000 접속

# 4. 서체 선택 드롭다운에서 각 폰트 테스트
```

## 현재 구현된 기능

✅ 서체 선택 드롭다운 (5개 폰트)
✅ 텍스트 크기 조절 (증감 버튼)
✅ 텍스트 두께 조절 (증감 버튼)
✅ 테두리 크기 조절 (증감 버튼)
✅ 테두리 두께 조절 (증감 버튼)
✅ **텍스트 X 위치 조절** (새로 추가!)
✅ **텍스트 Y 위치 조절** (새로 추가!)
✅ 텍스트 배치 (가로/세로)
✅ 도장 형상 선택 (원형/사각형)

## 문제 해결

### 폰트가 표시되지 않는 경우

1. **파일명 확인**
   ```bash
   ls /home/user/ImageGenerator/app/fonts/
   ```
   정확한 파일명이 있는지 확인

2. **개발 서버 재시작**
   ```bash
   # Ctrl+C로 중단 후
   npm run dev
   ```

3. **브라우저 캐시 삭제**
   - Chrome: `Ctrl+Shift+R` (강력 새로고침)

4. **Fallback 폰트 작동 확인**
   - 폰트 파일이 없어도 시스템 폰트로 작동해야 함
   - 궁서, 바탕, 돋움 등 시스템 폰트 사용

---

**다음 단계:**
1. 폰트 파일 5개를 `app/fonts/` 폴더에 추가
2. Git에 커밋하고 푸시
3. 개발 서버에서 테스트
4. 모든 폰트가 정상 작동하면 배포
