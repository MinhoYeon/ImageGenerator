'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState('홍길동');
  const [widthCm, setWidthCm] = useState(4);
  const [heightCm, setHeightCm] = useState(4);
  const [fileFormat, setFileFormat] = useState<'jpg' | 'png'>('jpg');

  // cm를 픽셀로 변환 (96 DPI 기준: 1cm = 37.8px)
  const cmToPixels = (cm: number) => Math.round(cm * 37.8);

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

    // 배경을 흰색으로 (JPG의 경우 투명도가 없으므로)
    if (fileFormat === 'jpg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    // 도장 원형 배경 (빨간색)
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;

    ctx.fillStyle = '#d32f2f';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    // 도장 테두리
    ctx.strokeStyle = '#b71c1c';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 이름 텍스트 그리기
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 폰트 크기 동적 조정
    const fontSize = radius * 0.8;
    ctx.font = `bold ${fontSize}px sans-serif`;

    // 텍스트를 세로로 표시 (한 글자씩)
    const chars = name.split('');
    const lineHeight = fontSize * 1.1;
    const totalHeight = chars.length * lineHeight;
    const startY = centerY - totalHeight / 2 + lineHeight / 2;

    chars.forEach((char, index) => {
      ctx.fillText(char, centerX, startY + index * lineHeight);
    });
  };

  // 이름이나 사이즈가 변경될 때마다 도장 다시 그리기
  useEffect(() => {
    drawStamp();
  }, [name, widthCm, heightCm, fileFormat]);

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
        link.download = `stamp_${name}.${fileFormat}`;
        link.click();
        URL.revokeObjectURL(url);
      },
      mimeType,
      quality
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-red-800 mb-8">
          도장 이미지 생성기
        </h1>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* 왼쪽: 설정 영역 */}
            <div className="space-y-6">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  가로 크기 (cm)
                </label>
                <input
                  type="number"
                  value={widthCm}
                  onChange={(e) => setWidthCm(Number(e.target.value))}
                  min="1"
                  max="20"
                  step="0.5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  세로 크기 (cm)
                </label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  min="1"
                  max="20"
                  step="0.5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
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

              <button
                onClick={downloadImage}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                이미지 다운로드
              </button>

              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                <p className="font-medium mb-2">현재 설정:</p>
                <ul className="space-y-1">
                  <li>• 크기: {widthCm} × {heightCm} cm</li>
                  <li>• 픽셀: {cmToPixels(widthCm)} × {cmToPixels(heightCm)} px</li>
                  <li>• 형식: {fileFormat.toUpperCase()}</li>
                </ul>
              </div>
            </div>

            {/* 오른쪽: 미리보기 영역 */}
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                미리보기
              </h2>
              <div className="border-4 border-gray-200 rounded-lg p-4 bg-white">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            💡 팁: 이름은 세로로 표시됩니다. 최적의 결과를 위해 2-3자를 권장합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
