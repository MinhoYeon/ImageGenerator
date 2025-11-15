'use client';

import { useEffect, useRef, useState } from 'react';

export default function TrademarkGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const downloadCanvasRef = useRef<HTMLCanvasElement>(null);

  // 기본값 상수
  const DEFAULT_TEXT = '상표명';
  const DEFAULT_DPI = 300;
  const DEFAULT_TEXT_SIZE = 120; // 픽셀 단위
  const SIZE_CM = 8; // 고정 크기 8cm x 8cm
  const FONT_FAMILY = "'Malgun Gothic', '맑은 고딕', sans-serif"; // 맑은 고딕 고정
  const FONT_WEIGHT = 400; // normal 고정

  const [text, setText] = useState(DEFAULT_TEXT);
  const [dpi, setDpi] = useState(DEFAULT_DPI);
  const [textSize, setTextSize] = useState(DEFAULT_TEXT_SIZE);

  // 초기화 함수
  const resetToDefault = () => {
    setText(DEFAULT_TEXT);
    setDpi(DEFAULT_DPI);
    setTextSize(DEFAULT_TEXT_SIZE);
  };

  // cm와 DPI를 픽셀로 변환 (8cm x 8cm)
  const cmToPixelsWithDPI = (cm: number, dpi: number) => {
    const inches = cm / 2.54; // cm를 inch로 변환
    return Math.round(inches * dpi);
  };

  // 현재 DPI에 따른 픽셀 크기
  const getPixelSize = () => cmToPixelsWithDPI(SIZE_CM, dpi);

  // 문자 상표 이미지 그리기
  const drawTrademark = (
    canvas: HTMLCanvasElement | null,
    width: number,
    height: number
  ) => {
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // 캔버스 크기 설정
    canvas.width = width;
    canvas.height = height;

    // 배경을 흰색으로
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // 텍스트가 없으면 종료
    if (!text.trim()) return;

    // 텍스트 그리기 설정
    ctx.fillStyle = '#000000'; // 흑색
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 폰트 크기를 DPI에 비례하여 조정
    const scaledTextSize = Math.round(textSize * (dpi / 300));
    ctx.font = `${FONT_WEIGHT} ${scaledTextSize}px ${FONT_FAMILY}`;

    // 캔버스 중앙에 텍스트 그리기
    const centerX = width / 2;
    const centerY = height / 2;

    // 여러 줄 텍스트 처리
    const lines = text.split('\n');
    const lineHeight = scaledTextSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = centerY - totalHeight / 2 + lineHeight / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), centerX, startY + index * lineHeight);
    });
  };

  // 미리보기 캔버스 그리기
  useEffect(() => {
    const drawPreview = () => {
      const pixelSize = getPixelSize();
      drawTrademark(canvasRef.current, pixelSize, pixelSize);
    };

    drawPreview();
  }, [text, dpi, textSize]);

  // 이미지 다운로드
  const downloadImage = () => {
    const downloadCanvas = downloadCanvasRef.current;
    if (!downloadCanvas) return;

    const pixelSize = getPixelSize();
    drawTrademark(downloadCanvas, pixelSize, pixelSize);

    // JPG 형식으로 다운로드 (RGB 모드, baseline/standard 형태)
    // canvas.toBlob은 기본적으로 baseline JPG를 생성하며 RGB 모드입니다
    downloadCanvas.toBlob(
      (blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `trademark_${text.replace(/\n/g, '_')}_${dpi}dpi.jpg`;
        link.click();
        URL.revokeObjectURL(url);
      },
      'image/jpeg',
      1.0 // 최고 품질, 압축 최소화
    );
  };

  const pixelSize = getPixelSize();

  return (
    <div>
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
        {/* 기본 설정 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">기본 설정</h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상표 문자 (한글, 영문, 한자)
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="상표 문자를 입력하세요"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                여러 줄로 입력 가능합니다
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                해상도 (DPI): {dpi}
              </label>
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setDpi(Math.max(100, dpi - 50))}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  ▼
                </button>
                <input
                  type="range"
                  value={dpi}
                  onChange={(e) => setDpi(Number(e.target.value))}
                  min="100"
                  max="500"
                  step="50"
                  className="flex-1"
                />
                <button
                  onClick={() => setDpi(Math.min(500, dpi + 50))}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  ▲
                </button>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>100 DPI</span>
                <span>500 DPI</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                크기: {SIZE_CM} × {SIZE_CM} cm ({pixelSize} × {pixelSize} px)
              </p>
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

          {/* 텍스트 크기 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              텍스트 크기: {textSize}px
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTextSize(Math.max(30, textSize - 10))}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                ▼
              </button>
              <input
                type="number"
                value={textSize}
                onChange={(e) => setTextSize(Math.min(300, Math.max(30, Number(e.target.value))))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center"
                min="30"
                max="300"
              />
              <button
                onClick={() => setTextSize(Math.min(300, textSize + 10))}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                ▲
              </button>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>30px</span>
              <span>300px</span>
            </div>
          </div>
        </div>

        {/* 미리보기 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
            미리보기
          </h3>

          <div className="flex justify-center items-center bg-gray-100 p-8 rounded-lg">
            <div className="border-2 border-gray-300 bg-white">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto"
                style={{ maxWidth: '500px', maxHeight: '500px' }}
              />
            </div>
          </div>
        </div>

        {/* 다운로드 버튼 */}
        <div className="flex justify-center">
          <button
            onClick={downloadImage}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md"
          >
            문자 상표 이미지 다운로드
          </button>
        </div>

        {/* 현재 설정 정보 */}
        <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <p className="font-medium mb-2">현재 설정:</p>
          <ul className="space-y-1">
            <li>• 상표 문자: {text.replace(/\n/g, ' ')}</li>
            <li>• 크기: {SIZE_CM} × {SIZE_CM} cm</li>
            <li>• 해상도: {dpi} DPI ({pixelSize} × {pixelSize} px)</li>
            <li>• 서체: 맑은 고딕</li>
            <li>• 텍스트 크기: {textSize}px (실제 {Math.round(textSize * (dpi / 300))}px)</li>
            <li>• 색상: 흑색 글자, 흰색 배경</li>
            <li>• 형식: JPG (RGB, Standard)</li>
          </ul>
        </div>

        {/* 주의사항 */}
        <div className="mt-6 text-sm text-gray-600 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="font-medium mb-2">📌 상표 출원 시 주의사항:</p>
          <ul className="space-y-1">
            <li>• 이미지 크기: 8cm × 8cm (고정)</li>
            <li>• 테두리 없음</li>
            <li>• 파일 형식: JPG (RGB 모드, Standard 형태)</li>
            <li>• 해상도: 100~500 DPI 조정 가능</li>
            <li>• 서체: 맑은 고딕 (시스템 기본 폰트)</li>
          </ul>
        </div>
      </div>

      {/* 숨겨진 다운로드용 캔버스 */}
      <canvas ref={downloadCanvasRef} style={{ display: 'none' }} />
    </div>
  );
}
