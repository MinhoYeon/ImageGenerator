'use client';

import { useState } from 'react';
import StampGenerator from '@/components/StampGenerator';
import TrademarkGenerator from '@/components/TrademarkGenerator';

type TabType = 'stamp' | 'trademark';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('stamp');

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-red-800 mb-6 md:mb-8">
          이미지 생성기
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

          {/* 도장 미리보기 그리드 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
              도장 형상 선택
            </h3>

            <div className="grid grid-cols-3 gap-4">
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
                    <div>{config.shape === 'circle' ? '원형' : config.shape === 'oval' ? '타원형' : '사각형'}</div>
                  </div>
                </div>
              ))}
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
                    onClick={() => setBorderSize(Math.min(50, borderSize + 1))}
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
                    onClick={() => setBorderSize(Math.max(5, borderSize - 1))}
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
                  {name.trim().length === 3 && (
                    <>
                      {textLayout === 'horizontal' && '3글자: 좌우 배치'}
                      {(textLayout === 'vertical-right' || textLayout === 'vertical-left') && '3글자: 위아래 배치'}
                    </>
                  )}
                  {name.trim().length === 2 && (
                    <>
                      {textLayout === 'horizontal' && '2글자: 좌우 배치'}
                      {(textLayout === 'vertical-right' || textLayout === 'vertical-left') && '2글자: 위아래 배치'}
                    </>
                  )}
                  {name.trim().length !== 2 && name.trim().length !== 3 && name.trim().length !== 4 && '2, 3, 4글자에 적용'}
                </p>
              </div>
            </div>
          </div>

          {/* 다운로드 버튼 */}
          <div className="flex justify-center">
            <button
              onClick={() => setActiveTab('trademark')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 ${
                activeTab === 'trademark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              상표 이미지 생성기
            </button>
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="bg-white rounded-b-lg shadow-lg">
          {activeTab === 'stamp' && <StampGenerator />}
          {activeTab === 'trademark' && <TrademarkGenerator />}
        </div>

        {/* 면책조항 */}
        <div className="mt-6 text-center text-gray-600">
          {activeTab === 'stamp' && (
            <>
              <p className="text-sm">
                전통적인 한국 도장 스타일 - 다양한 서체와 세밀한 조절 옵션으로 나만의 도장을 만드세요
              </p>
            </>
          )}
          {activeTab === 'trademark' && (
            <>
              <p className="text-sm">
                문자 상표 출원용 이미지 생성 - 상표청 제출 요건에 맞는 이미지를 생성하세요
              </p>
            </>
          )}
          <p className="text-sm mt-2">
            저작권 관련 문제가 있다면 연락주시기 바랍니다. office@jinip.kr
          </p>
        </div>
      </div>
    </div>
  );
}
