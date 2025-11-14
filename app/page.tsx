'use client';

import { useEffect, useRef, useState } from 'react';

type StampShape = 'circle' | 'square';
type FontFamily = 'gungseo' | 'batang';
type TextLayout = 'horizontal' | 'vertical-right' | 'vertical-left';

interface StampConfig {
  shape: StampShape;
  font: FontFamily;
}

export default function Home() {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const downloadCanvasRef = useRef<HTMLCanvasElement>(null);

  const [name, setName] = useState('홍길동인');
  const [widthCm, setWidthCm] = useState(4);
  const [heightCm, setHeightCm] = useState(4);
  const [fileFormat, setFileFormat] = useState<'jpg' | 'png'>('jpg');
  const [selectedStamp, setSelectedStamp] = useState<number>(0);

  // 새로운 조절 옵션
  const [textSize, setTextSize] = useState(0.39); // 기본값: 0.39 (도장 크기의 39%)
  const [textWeight, setTextWeight] = useState(700); // 기본값: 700 (bold)
  const [borderSize, setBorderSize] = useState(20); // 기본값: 20px (도장 여백)
  const [borderWidth, setBorderWidth] = useState(4); // 기본값: 4px
  const [textLayout, setTextLayout] = useState<TextLayout>('horizontal');

  // 모든 도장 조합 (4개)
  const stampConfigs: StampConfig[] = [
    { shape: 'circle', font: 'gungseo' },
    { shape: 'square', font: 'gungseo' },
    { shape: 'circle', font: 'batang' },
    { shape: 'square', font: 'batang' }
  ];

  // 폰트 매핑
  const fontMap: Record<FontFamily, string> = {
    gungseo: '"Gungsuh", "Gungseo", "궁서", serif',
    batang: '"Batang", "바탕", "Noto Serif KR", serif'
  };

  // 폰트 이름 (한글)
  const fontNameMap: Record<FontFamily, string> = {
    gungseo: '궁서체',
    batang: '바탕체'
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

    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height) - borderSize;

    // 도장 배경 그리기 (흰색)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();

    if (config.shape === 'circle') {
      ctx.arc(centerX, centerY, size / 2, 0, 2 * Math.PI);
    } else {
      ctx.rect(centerX - size / 2, centerY - size / 2, size, size);
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
      // 2글자인 경우 세로 배치
      const spacing = fontSize * 1.2;
      ctx.fillText(chars[0], centerX, centerY - spacing / 2);
      ctx.fillText(chars[1], centerX, centerY + spacing / 2);
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

  // 모든 미리보기 캔버스 그리기
  useEffect(() => {
    const width = cmToPixels(widthCm);
    const height = cmToPixels(heightCm);

    canvasRefs.current.forEach((canvas, index) => {
      if (canvas) {
        drawStamp(canvas, stampConfigs[index], width, height);
      }
    });
  }, [name, widthCm, heightCm, textSize, textWeight, borderSize, borderWidth, textLayout]);

  // 이미지 다운로드
  const downloadImage = () => {
    const downloadCanvas = downloadCanvasRef.current;
    if (!downloadCanvas) return;

    const ctx = downloadCanvas.getContext('2d');
    if (!ctx) return;

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
        link.download = `stamp_${name}_${config.shape}_${config.font}_${textLayout}.${fileFormat}`;
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
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">스타일 조절</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  텍스트 크기: {Math.round(textSize * 100)}%
                </label>
                <input
                  type="range"
                  min="0.15"
                  max="0.60"
                  step="0.01"
                  value={textSize}
                  onChange={(e) => setTextSize(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>15%</span>
                  <span>60%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  텍스트 두께: {textWeight}
                </label>
                <input
                  type="range"
                  min="100"
                  max="900"
                  step="100"
                  value={textWeight}
                  onChange={(e) => setTextWeight(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>가늘게</span>
                  <span>굵게</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  테두리 크기: {borderSize}px
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={borderSize}
                  onChange={(e) => setBorderSize(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>작게</span>
                  <span>크게</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  테두리 두께: {borderWidth}px
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1px</span>
                  <span>15px</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  텍스트 배치 (4글자용)
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
                  {textLayout === 'horizontal' && '위: 홍길 / 아래: 동인'}
                  {textLayout === 'vertical-right' && '우: 홍길 / 좌: 동인'}
                  {textLayout === 'vertical-left' && '좌: 홍길 / 우: 동인'}
                </p>
              </div>
            </div>
          </div>

          {/* 도장 미리보기 그리드 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
              도장 선택
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                      ref={(el) => (canvasRefs.current[index] = el)}
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
              <li>• 선택: {stampConfigs[selectedStamp].shape === 'circle' ? '원형' : '사각형'} / {fontNameMap[stampConfigs[selectedStamp].font]}</li>
              <li>• 텍스트 배치: {textLayoutNameMap[textLayout]}</li>
              <li>• 형식: {fileFormat.toUpperCase()}</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-600">
          <p className="text-sm">
            전통적인 한국 도장 스타일 - 원형/사각형 형상과 궁서/바탕 글씨체로 제공됩니다
          </p>
        </div>
      </div>

      {/* 숨겨진 다운로드용 캔버스 */}
      <canvas ref={downloadCanvasRef} style={{ display: 'none' }} />
    </div>
  );
}
