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

        {/* 탭 메뉴 */}
        <div className="bg-white rounded-t-lg shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('stamp')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 ${
                activeTab === 'stamp'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              도장 이미지 생성기
            </button>
            <button
              onClick={() => setActiveTab('trademark')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 ${
                activeTab === 'trademark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              문자 상표 이미지 생성기
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
