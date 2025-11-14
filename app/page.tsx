'use client';

import { useEffect, useRef, useState } from 'react';

type StampShape = 'circle' | 'square' | 'rectangle' | 'oval';
type FontFamily = 'gungseo' | 'batang' | 'myeongjo';
type TextLayout = 'vertical' | 'horizontal' | 'centered';
type StampColor = 'red' | 'darkred' | 'orange';
type BorderStyle = 'flat' | 'textured' | 'rough';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState('홍길동');
  const [widthCm, setWidthCm] = useState(4);
  const [heightCm, setHeightCm] = useState(4);
  const [fileFormat, setFileFormat] = useState<'jpg' | 'png'>('jpg');

  // 새로운 옵션들
  const [stampShape, setStampShape] = useState<StampShape>('circle');
  const [fontFamily, setFontFamily] = useState<FontFamily>('gungseo');
  const [textLayout, setTextLayout] = useState<TextLayout>('vertical');
  const [stampColor, setStampColor] = useState<StampColor>('red');
  const [borderStyle, setBorderStyle] = useState<BorderStyle>('flat');
  const [showTexture, setShowTexture] = useState(true);

  // cm를 픽셀로 변환 (96 DPI 기준: 1cm = 37.8px)
  const cmToPixels = (cm: number) => Math.round(cm * 37.8);

  // 색상 매핑
  const colorMap: Record<StampColor, { fill: string; stroke: string }> = {
    red: { fill: '#d32f2f', stroke: '#b71c1c' },
    darkred: { fill: '#b71c1c', stroke: '#8b0000' },
    orange: { fill: '#e65100', stroke: '#bf360c' }
  };

  // 폰트 매핑
  const fontMap: Record<FontFamily, string> = {
    gungseo: '"Gungsuh", "Gungseo", "궁서", serif',
    batang: '"Batang", "바탕", "Noto Serif KR", serif',
    myeongjo: '"Nanum Myeongjo", "명조", serif'
  };

  // 텍스처 효과 추가
  const addTexture = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // 빨간색 채널만 있는 픽셀에 노이즈 추가 (도장 영역)
      if (data[i] > 100 && data[i + 1] < 100 && data[i + 2] < 100) {
        const noise = (Math.random() - 0.5) * 30;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // 거친 테두리 효과
  const drawRoughBorder = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    size: number,
    shape: StampShape
  ) => {
    ctx.strokeStyle = colorMap[stampColor].stroke;
    ctx.lineWidth = 4;
    ctx.beginPath();

    if (shape === 'circle' || shape === 'oval') {
      const radiusX = shape === 'oval' ? size * 0.6 : size * 0.5;
      const radiusY = size * 0.5;

      for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const noise = borderStyle === 'rough' ? (Math.random() - 0.5) * 3 : 0;
        const x = centerX + (radiusX + noise) * Math.cos(angle);
        const y = centerY + (radiusY + noise) * Math.sin(angle);

        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
    } else {
      // 사각형 계열
      const halfWidth = size * 0.5;
      const halfHeight = shape === 'rectangle' ? size * 0.35 : size * 0.5;

      const points = [
        [-halfWidth, -halfHeight],
        [halfWidth, -halfHeight],
        [halfWidth, halfHeight],
        [-halfWidth, halfHeight]
      ];

      points.forEach((point, index) => {
        const noise = borderStyle === 'rough' ? (Math.random() - 0.5) * 3 : 0;
        const x = centerX + point[0] + noise;
        const y = centerY + point[1] + noise;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
    }

    ctx.closePath();
    ctx.stroke();
  };

  // 도장 이미지 그리기
  const drawStamp = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = cmToPixels(widthCm);
    const height = cmToPixels(heightCm);

    // 캔버스 크기 설정
    canvas.width = width;
    canvas.height = height;

    // 배경 설정
    if (fileFormat === 'jpg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height) - 20;

    // 도장 배경 그리기
    ctx.fillStyle = colorMap[stampColor].fill;
    ctx.beginPath();

    switch (stampShape) {
      case 'circle':
        ctx.arc(centerX, centerY, size / 2, 0, 2 * Math.PI);
        break;
      case 'oval':
        ctx.ellipse(centerX, centerY, size * 0.6, size * 0.5, 0, 0, 2 * Math.PI);
        break;
      case 'square':
        ctx.rect(centerX - size / 2, centerY - size / 2, size, size);
        break;
      case 'rectangle':
        ctx.rect(centerX - size / 2, centerY - size * 0.35, size, size * 0.7);
        break;
    }

    ctx.fill();

    // 테두리 그리기
    if (borderStyle === 'rough' || borderStyle === 'textured') {
      drawRoughBorder(ctx, centerX, centerY, size, stampShape);
    } else {
      ctx.strokeStyle = colorMap[stampColor].stroke;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // 텍스트 그리기
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fontSize = size * 0.35;
    ctx.font = `bold ${fontSize}px ${fontMap[fontFamily]}`;

    const chars = name.split('');

    if (textLayout === 'vertical') {
      // 세로 배치
      const lineHeight = fontSize * 1.1;
      const totalHeight = chars.length * lineHeight;
      const startY = centerY - totalHeight / 2 + lineHeight / 2;

      chars.forEach((char, index) => {
        ctx.fillText(char, centerX, startY + index * lineHeight);
      });
    } else if (textLayout === 'horizontal') {
      // 가로 배치
      ctx.fillText(name, centerX, centerY);
    } else {
      // 중앙 집중형 (2-3글자인 경우 최적화)
      if (chars.length === 2) {
        const spacing = fontSize * 1.2;
        ctx.fillText(chars[0], centerX, centerY - spacing / 2);
        ctx.fillText(chars[1], centerX, centerY + spacing / 2);
      } else if (chars.length === 3) {
        const spacing = fontSize * 0.9;
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
    }

    // 텍스처 효과 추가
    if (showTexture && (borderStyle === 'textured' || borderStyle === 'rough')) {
      addTexture(ctx, width, height);
    }
  };

  // 설정 변경 시 도장 다시 그리기
  useEffect(() => {
    drawStamp();
  }, [name, widthCm, heightCm, fileFormat, stampShape, fontFamily, textLayout, stampColor, borderStyle, showTexture]);

  // 이미지 다운로드
  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mimeType = fileFormat === 'jpg' ? 'image/jpeg' : 'image/png';
    const quality = fileFormat === 'jpg' ? 0.95 : undefined;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `stamp_${name}_${stampShape}.${fileFormat}`;
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

        <div className="bg-white rounded-lg shadow-xl p-4 md:p-8">
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* 왼쪽: 기본 설정 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">기본 설정</h3>

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
              </div>

              <div className="grid grid-cols-2 gap-3">
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  파일 형식
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="jpg"
                      checked={fileFormat === 'jpg'}
                      onChange={(e) => setFileFormat(e.target.value as 'jpg')}
                      className="mr-2"
                    />
                    <span>JPG</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="png"
                      checked={fileFormat === 'png'}
                      onChange={(e) => setFileFormat(e.target.value as 'png')}
                      className="mr-2"
                    />
                    <span>PNG</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 중간: 스타일 설정 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">스타일 설정</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  도장 형상
                </label>
                <select
                  value={stampShape}
                  onChange={(e) => setStampShape(e.target.value as StampShape)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="circle">원형 (전통적)</option>
                  <option value="oval">타원형</option>
                  <option value="square">정사각형</option>
                  <option value="rectangle">직사각형</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  글씨체
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value as FontFamily)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="gungseo">궁서체 (인감체)</option>
                  <option value="batang">바탕체</option>
                  <option value="myeongjo">명조체</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  텍스트 배치
                </label>
                <select
                  value={textLayout}
                  onChange={(e) => setTextLayout(e.target.value as TextLayout)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="vertical">세로 배치</option>
                  <option value="horizontal">가로 배치</option>
                  <option value="centered">중앙 집중형</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  인주 색상
                </label>
                <select
                  value={stampColor}
                  onChange={(e) => setStampColor(e.target.value as StampColor)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="red">빨강 (전통)</option>
                  <option value="darkred">진한 빨강</option>
                  <option value="orange">주황</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  도장날 스타일
                </label>
                <select
                  value={borderStyle}
                  onChange={(e) => setBorderStyle(e.target.value as BorderStyle)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="flat">평평한 날</option>
                  <option value="textured">텍스처 날</option>
                  <option value="rough">거친 날</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="texture"
                  checked={showTexture}
                  onChange={(e) => setShowTexture(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="texture" className="text-sm text-gray-700 cursor-pointer">
                  인주 텍스처 효과
                </label>
              </div>
            </div>

            {/* 오른쪽: 미리보기 */}
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">미리보기</h3>

              <div className="flex-1 flex items-center justify-center border-4 border-gray-200 rounded-lg p-4 bg-gray-50">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto"
                  style={{ maxHeight: '350px' }}
                />
              </div>

              <button
                onClick={downloadImage}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md"
              >
                이미지 다운로드
              </button>

              <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                <p className="font-medium mb-1">현재 설정:</p>
                <ul className="space-y-0.5">
                  <li>• 크기: {widthCm} × {heightCm} cm</li>
                  <li>• 픽셀: {cmToPixels(widthCm)} × {cmToPixels(heightCm)} px</li>
                  <li>• 형상: {stampShape === 'circle' ? '원형' : stampShape === 'square' ? '정사각형' : stampShape === 'oval' ? '타원형' : '직사각형'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-600">
          <p className="text-sm">
            전통적인 한국 도장 스타일로 다양한 형상과 글씨체를 선택할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
