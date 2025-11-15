'use client';

import { useEffect, useRef, useState } from 'react';

type StampShape = 'circle' | 'square';
type FontFamily = 'museum-classic' | 'gungseo' | 'batang' | 'dotum' | 'myeongjo';
type TextLayout = 'horizontal' | 'vertical-right' | 'vertical-left';

interface StampConfig {
  shape: StampShape;
  font: FontFamily;
}

export default function Home() {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const downloadCanvasRef = useRef<HTMLCanvasElement>(null);

  // 기본값 상수
  const DEFAULT_NAME = '홍길동인';
  const DEFAULT_WIDTH_CM = 4;
  const DEFAULT_HEIGHT_CM = 4;
  const DEFAULT_FILE_FORMAT: 'jpg' | 'png' = 'jpg';
  const DEFAULT_FONT: FontFamily = 'museum-classic';
  const DEFAULT_TEXT_SIZE = 0.50;
  const DEFAULT_TEXT_WEIGHT = 700;
  const DEFAULT_BORDER_SIZE = 20;
  const DEFAULT_BORDER_WIDTH = 4;
  const DEFAULT_TEXT_LAYOUT: TextLayout = 'horizontal';
  const DEFAULT_SELECTED_STAMP = 0;
  const DEFAULT_TEXT_OFFSET_X = 0;
  const DEFAULT_TEXT_OFFSET_Y = 0;

  const [name, setName] = useState(DEFAULT_NAME);
  const [widthCm, setWidthCm] = useState(DEFAULT_WIDTH_CM);
  const [heightCm, setHeightCm] = useState(DEFAULT_HEIGHT_CM);
  const [fileFormat, setFileFormat] = useState<'jpg' | 'png'>(DEFAULT_FILE_FORMAT);
  const [selectedStamp, setSelectedStamp] = useState<number>(DEFAULT_SELECTED_STAMP);
  const [selectedFont, setSelectedFont] = useState<FontFamily>(DEFAULT_FONT);

  // 새로운 조절 옵션
  const [textSize, setTextSize] = useState(DEFAULT_TEXT_SIZE); // 기본값: 0.39 (도장 크기의 39%)
  const [textWeight, setTextWeight] = useState(DEFAULT_TEXT_WEIGHT); // 기본값: 700 (bold)
  const [borderSize, setBorderSize] = useState(DEFAULT_BORDER_SIZE); // 기본값: 20px (도장 여백)
  const [borderWidth, setBorderWidth] = useState(DEFAULT_BORDER_WIDTH); // 기본값: 4px
  const [textLayout, setTextLayout] = useState<TextLayout>(DEFAULT_TEXT_LAYOUT);
  const [textOffsetX, setTextOffsetX] = useState(DEFAULT_TEXT_OFFSET_X); // 텍스트 X 위치 조절
  const [textOffsetY, setTextOffsetY] = useState(DEFAULT_TEXT_OFFSET_Y); // 텍스트 Y 위치 조절

  // 초기화 함수
  const resetToDefault = () => {
    setName(DEFAULT_NAME);
    setWidthCm(DEFAULT_WIDTH_CM);
    setHeightCm(DEFAULT_HEIGHT_CM);
    setFileFormat(DEFAULT_FILE_FORMAT);
    setSelectedStamp(DEFAULT_SELECTED_STAMP);
    setSelectedFont(DEFAULT_FONT);
    setTextSize(DEFAULT_TEXT_SIZE);
    setTextWeight(DEFAULT_TEXT_WEIGHT);
    setBorderSize(DEFAULT_BORDER_SIZE);
    setBorderWidth(DEFAULT_BORDER_WIDTH);
    setTextLayout(DEFAULT_TEXT_LAYOUT);
    setTextOffsetX(DEFAULT_TEXT_OFFSET_X);
    setTextOffsetY(DEFAULT_TEXT_OFFSET_Y);
  };

  // 모든 도장 조합 (2개 - 형상만)
  const stampConfigs: StampConfig[] = [
    { shape: 'circle', font: selectedFont },
    { shape: 'square', font: selectedFont }
  ];

  // 폰트 매핑 - Canvas용 실제 폰트 패밀리 이름
  const fontMap: Record<FontFamily, string> = {
    'museum-classic': 'MuseumClassic, serif',
    'gungseo': 'ChosunCentennial, serif',
    'batang': 'KoPubBatang, serif',
    'dotum': 'KoPubDotum, sans-serif',
    'myeongjo': 'NanumMyeongjo, serif'
  };

  // 폰트 이름 (한글)
  const fontNameMap: Record<FontFamily, string> = {
    'museum-classic': '국립박물관문화재단클래식B',
    'gungseo': '궁서체',
    'batang': '바탕체',
    'dotum': '돋움체',
    'myeongjo': '명조체'
  };

  // 텍스트 배치 이름
  const textLayoutNameMap: Record<TextLayout, string> = {
    'horizontal': '가로형',
    'vertical-right': '세로형(우측)',
    'vertical-left': '세로형(좌측)'
  };

  // cm를 픽셀로 변환 (96 DPI 기준: 1cm = 37.8px)
  const cmToPixels = (cm: number) => Math.round(cm * 37.8);

  // 도장 이미지 그리기
  const drawStamp = (
    canvas: HTMLCanvasElement | null,
    config: StampConfig,
    width: number,
    height: number
  ) => {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기 설정
    canvas.width = width;
    canvas.height = height;

    // 배경을 흰색으로
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2 + textOffsetX;
    const centerY = height / 2 + textOffsetY;
    const borderCenterX = width / 2;
    const borderCenterY = height / 2;
    const size = Math.min(width, height) - borderSize;

    // 도장 배경 그리기 (흰색)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();

    if (config.shape === 'circle') {
      ctx.arc(borderCenterX, borderCenterY, size / 2, 0, 2 * Math.PI);
    } else {
      ctx.rect(borderCenterX - size / 2, borderCenterY - size / 2, size, size);
    }
    ctx.fill();

    // 도장 테두리 (빨간색)
    ctx.strokeStyle = '#d32f2f';
    ctx.lineWidth = borderWidth;
    ctx.stroke();

    // 텍스트 그리기
    const chars = name.trim().split('');
    if (chars.length === 0) return;

    ctx.fillStyle = '#d32f2f';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 폰트 크기 동적 조정
    const fontSize = size * textSize;
    ctx.font = `${textWeight} ${fontSize}px ${fontMap[config.font]}`;

    if (chars.length === 4) {
      if (textLayout === 'horizontal') {
        // 가로형: 2x2 배치 (위: 홍길, 아래: 동인)
        const horizontalSpacing = fontSize * 0.9;
        const verticalSpacing = fontSize * 1.1;

        // 위쪽 2글자
        ctx.fillText(chars[0], centerX - horizontalSpacing / 2, centerY - verticalSpacing / 2);
        ctx.fillText(chars[1], centerX + horizontalSpacing / 2, centerY - verticalSpacing / 2);

        // 아래쪽 2글자
        ctx.fillText(chars[2], centerX - horizontalSpacing / 2, centerY + verticalSpacing / 2);
        ctx.fillText(chars[3], centerX + horizontalSpacing / 2, centerY + verticalSpacing / 2);
      } else if (textLayout === 'vertical-right') {
        // 세로형(우측): 우측 컬럼에 '홍길', 좌측 컬럼에 '동인'
        const horizontalSpacing = fontSize * 0.9;
        const verticalSpacing = fontSize * 1.1;

        // 우측 컬럼 (홍길)
        ctx.fillText(chars[0], centerX + horizontalSpacing / 2, centerY - verticalSpacing / 2);
        ctx.fillText(chars[1], centerX + horizontalSpacing / 2, centerY + verticalSpacing / 2);

        // 좌측 컬럼 (동인)
        ctx.fillText(chars[2], centerX - horizontalSpacing / 2, centerY - verticalSpacing / 2);
        ctx.fillText(chars[3], centerX - horizontalSpacing / 2, centerY + verticalSpacing / 2);
      } else {
        // 세로형(좌측): 좌측 컬럼에 '홍길', 우측 컬럼에 '동인'
        const horizontalSpacing = fontSize * 0.9;
        const verticalSpacing = fontSize * 1.1;

        // 좌측 컬럼 (홍길)
        ctx.fillText(chars[0], centerX - horizontalSpacing / 2, centerY - verticalSpacing / 2);
        ctx.fillText(chars[1], centerX - horizontalSpacing / 2, centerY + verticalSpacing / 2);

        // 우측 컬럼 (동인)
        ctx.fillText(chars[2], centerX + horizontalSpacing / 2, centerY - verticalSpacing / 2);
        ctx.fillText(chars[3], centerX + horizontalSpacing / 2, centerY + verticalSpacing / 2);
      }
    } else if (chars.length === 2) {
      // 2글자인 경우 배치
      if (textLayout === 'horizontal') {
        // 가로형: 좌우로 배치
        const horizontalSpacing = fontSize * 0.9;
        ctx.fillText(chars[0], centerX - horizontalSpacing / 2, centerY);
        ctx.fillText(chars[1], centerX + horizontalSpacing / 2, centerY);
      } else {
        // 세로형(좌측/우측 동일): 위아래로 배치
        const verticalSpacing = fontSize * 1.2;
        ctx.fillText(chars[0], centerX, centerY - verticalSpacing / 2);
        ctx.fillText(chars[1], centerX, centerY + verticalSpacing / 2);
      }
    } else if (chars.length === 3) {
      // 3글자인 경우 세로 배치
      const spacing = fontSize * 1.0;
      ctx.fillText(chars[0], centerX, centerY - spacing);
      ctx.fillText(chars[1], centerX, centerY);
      ctx.fillText(chars[2], centerX, centerY + spacing);
    } else {
      // 기타 경우 세로로 표시
      const lineHeight = fontSize * 1.1;
      const totalHeight = chars.length * lineHeight;
      const startY = centerY - totalHeight / 2 + lineHeight / 2;

      chars.forEach((char, index) => {
        ctx.fillText(char, centerX, startY + index * lineHeight);
      });
    }
  };

  // 모든 미리보기 캔버스 그리기 (폰트 로딩 후)
  useEffect(() => {
    const drawAllStamps = async () => {
      // 폰트가 로드될 때까지 기다림
      if (typeof document !== 'undefined' && document.fonts) {
        await document.fonts.ready;
      }

      const width = cmToPixels(widthCm);
      const height = cmToPixels(heightCm);

      canvasRefs.current.forEach((canvas, index) => {
        if (canvas) {
          drawStamp(canvas, stampConfigs[index], width, height);
        }
      });
    };

    drawAllStamps();
  }, [name, widthCm, heightCm, textSize, textWeight, borderSize, borderWidth, textLayout, textOffsetX, textOffsetY, selectedFont]);

  // 이미지 다운로드 (폰트 로딩 후)
  const downloadImage = async () => {
    const downloadCanvas = downloadCanvasRef.current;
    if (!downloadCanvas) return;

    const ctx = downloadCanvas.getContext('2d');
    if (!ctx) return;

    // 폰트가 로드될 때까지 기다림
    if (typeof document !== 'undefined' && document.fonts) {
      await document.fonts.ready;
    }

    const width = cmToPixels(widthCm);
    const height = cmToPixels(heightCm);

    // 선택된 도장 그리기
    drawStamp(downloadCanvas, stampConfigs[selectedStamp], width, height);

    const mimeType = fileFormat === 'jpg' ? 'image/jpeg' : 'image/png';
    const quality = fileFormat === 'jpg' ? 0.95 : undefined;

    downloadCanvas.toBlob(
      (blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const config = stampConfigs[selectedStamp];
        link.download = `stamp_${name}_${config.shape}_${selectedFont}_${textLayout}.${fileFormat}`;
        link.click();
        URL.revokeObjectURL(url);
      },
      mimeType,
      quality
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-red-800 mb-6 md:mb-8">
          도장 이미지 생성기
        </h1>

        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          {/* 기본 설정 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">기본 설정</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="이름을 입력하세요"
                />
                <p className="text-xs text-gray-500 mt-1">
                  3글자 이름은 끝에 '인'을 추가해주세요 (예: 홍길동 → 홍길동인)
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    가로 (cm)
                  </label>
                  <input
                    type="number"
                    value={widthCm}
                    onChange={(e) => setWidthCm(Number(e.target.value))}
                    min="1"
                    max="20"
                    step="0.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    세로 (cm)
                  </label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    min="1"
                    max="20"
                    step="0.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    파일 형식
                  </label>
                  <select
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value as 'jpg' | 'png')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="jpg">JPG</option>
                    <option value="png">PNG</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 스타일 조절 */}
          <div className="mb-8">
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-800">스타일 조절</h3>
              <button
                onClick={resetToDefault}
                className="px-4 py-1.5 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                초기화
              </button>
            </div>

            {/* 폰트 선택 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                서체 선택
              </label>
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value as FontFamily)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {Object.entries(fontNameMap).map(([key, name]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 텍스트 크기 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  텍스트 크기: {Math.round(textSize * 100)}%
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTextSize(Math.max(0.20, textSize - 0.01))}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    ▼
                  </button>
                  <input
                    type="number"
                    value={Math.round(textSize * 100)}
                    onChange={(e) => setTextSize(Math.min(0.80, Math.max(0.20, Number(e.target.value) / 100)))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center"
                    min="20"
                    max="80"
                  />
                  <button
                    onClick={() => setTextSize(Math.min(0.80, textSize + 0.01))}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    ▲
                  </button>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>20%</span>
                  <span>80%</span>
                </div>
              </div>

              {/* 텍스트 두께 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  텍스트 두께: {textWeight}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTextWeight(Math.max(100, textWeight - 100))}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    ▼
                  </button>
                  <input
                    type="number"
                    value={textWeight}
                    onChange={(e) => setTextWeight(Math.min(900, Math.max(100, Number(e.target.value))))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center"
                    min="100"
                    max="900"
                    step="100"
                  />
                  <button
                    onClick={() => setTextWeight(Math.min(900, textWeight + 100))}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    ▲
                  </button>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>가늘게</span>
                  <span>굵게</span>
                </div>
              </div>

              {/* 테두리 크기 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  테두리 크기: {borderSize}px
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBorderSize(Math.max(5, borderSize - 1))}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    ▼
                  </button>
                  <input
                    type="number"
                    value={borderSize}
                    onChange={(e) => setBorderSize(Math.min(50, Math.max(5, Number(e.target.value))))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center"
                    min="5"
                    max="50"
                  />
                  <button
                    onClick={() => setBorderSize(Math.min(50, borderSize + 1))}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    ▲
                  </button>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>작게</span>
                  <span>크게</span>
                </div>
              </div>

              {/* 테두리 두께 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  테두리 두께: {borderWidth}px
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBorderWidth(Math.max(1, borderWidth - 1))}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    ▼
                  </button>
                  <input
                    type="number"
                    value={borderWidth}
                    onChange={(e) => setBorderWidth(Math.min(15, Math.max(1, Number(e.target.value))))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center"
                    min="1"
                    max="15"
                  />
                  <button
                    onClick={() => setBorderWidth(Math.min(15, borderWidth + 1))}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    ▲
                  </button>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1px</span>
                  <span>15px</span>
                </div>
              </div>

              {/* 텍스트 X 위치 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  텍스트 X 위치: {textOffsetX}px
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTextOffsetX(Math.max(-50, textOffsetX - 1))}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    ◀
                  </button>
                  <input
                    type="number"
                    value={textOffsetX}
                    onChange={(e) => setTextOffsetX(Math.min(50, Math.max(-50, Number(e.target.value))))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center"
                    min="-50"
                    max="50"
                  />
                  <button
                    onClick={() => setTextOffsetX(Math.min(50, textOffsetX + 1))}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    ▶
                  </button>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>왼쪽</span>
                  <span>오른쪽</span>
                </div>
              </div>

              {/* 텍스트 Y 위치 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  텍스트 Y 위치: {textOffsetY}px
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTextOffsetY(Math.max(-50, textOffsetY - 1))}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    ▲
                  </button>
                  <input
                    type="number"
                    value={textOffsetY}
                    onChange={(e) => setTextOffsetY(Math.min(50, Math.max(-50, Number(e.target.value))))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center"
                    min="-50"
                    max="50"
                  />
                  <button
                    onClick={() => setTextOffsetY(Math.min(50, textOffsetY + 1))}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    ▼
                  </button>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>위쪽</span>
                  <span>아래쪽</span>
                </div>
              </div>

              {/* 텍스트 배치 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  텍스트 배치
                </label>
                <select
                  value={textLayout}
                  onChange={(e) => setTextLayout(e.target.value as TextLayout)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="horizontal">가로형</option>
                  <option value="vertical-right">세로형(우측)</option>
                  <option value="vertical-left">세로형(좌측)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {name.trim().length === 4 && (
                    <>
                      {textLayout === 'horizontal' && '4글자: 위 홍길 / 아래 동인'}
                      {textLayout === 'vertical-right' && '4글자: 우 홍길 / 좌 동인'}
                      {textLayout === 'vertical-left' && '4글자: 좌 홍길 / 우 동인'}
                    </>
                  )}
                  {name.trim().length === 2 && (
                    <>
                      {textLayout === 'horizontal' && '2글자: 좌우 배치'}
                      {(textLayout === 'vertical-right' || textLayout === 'vertical-left') && '2글자: 위아래 배치'}
                    </>
                  )}
                  {name.trim().length !== 2 && name.trim().length !== 4 && '2글자 또는 4글자에 적용'}
                </p>
              </div>
            </div>
          </div>

          {/* 도장 미리보기 그리드 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
              도장 형상 선택
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {stampConfigs.map((config, index) => (
                <div
                  key={index}
                  className={`relative border-4 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedStamp === index
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                  onClick={() => setSelectedStamp(index)}
                >
                  {/* 라디오 버튼 */}
                  <div className="absolute top-2 left-2">
                    <input
                      type="radio"
                      name="stamp"
                      checked={selectedStamp === index}
                      onChange={() => setSelectedStamp(index)}
                      className="w-4 h-4 text-red-600 cursor-pointer"
                    />
                  </div>

                  {/* 캔버스 */}
                  <div className="flex items-center justify-center mb-2">
                    <canvas
                      ref={(el) => { canvasRefs.current[index] = el; }}
                      className="max-w-full h-auto"
                      style={{ maxHeight: '150px' }}
                    />
                  </div>

                  {/* 라벨 */}
                  <div className="text-center text-xs text-gray-600">
                    <div>{config.shape === 'circle' ? '원형' : '사각형'}</div>
                    <div>{fontNameMap[config.font]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 다운로드 버튼 */}
          <div className="flex justify-center">
            <button
              onClick={downloadImage}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md"
            >
              선택한 도장 다운로드
            </button>
          </div>

          {/* 현재 설정 정보 */}
          <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
            <p className="font-medium mb-2">현재 설정:</p>
            <ul className="space-y-1">
              <li>• 이름: {name}</li>
              <li>• 크기: {widthCm} × {heightCm} cm ({cmToPixels(widthCm)} × {cmToPixels(heightCm)} px)</li>
              <li>• 형상: {stampConfigs[selectedStamp].shape === 'circle' ? '원형' : '사각형'}</li>
              <li>• 서체: {fontNameMap[selectedFont]}</li>
              <li>• 텍스트 배치: {textLayoutNameMap[textLayout]}</li>
              <li>• 텍스트 위치: X={textOffsetX}px, Y={textOffsetY}px</li>
              <li>• 형식: {fileFormat.toUpperCase()}</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-600">
          <p className="text-sm">
            전통적인 한국 도장 스타일 - 다양한 서체와 세밀한 조절 옵션으로 나만의 도장을 만드세요
          </p>
        </div>
      </div>

      {/* 숨겨진 다운로드용 캔버스 */}
      <canvas ref={downloadCanvasRef} style={{ display: 'none' }} />
    </div>
  );
}
