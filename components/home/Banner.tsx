
'use client'
import React from 'react';
import { Carousel, Typography, Space } from '@douyinfe/semi-ui';

export default function Banner() {
  const { Title, Paragraph } = Typography;

  const imgList = [
    '/banner-1.jpg',
    '/banner-2.jpg',
    '/banner-3.jpg',
  ];

  const textList = [
    ['AI 作业布置', '快速生成个性化练习作业'],
    ['AI 作业批改', '快速准确批改作业并针对性分析'],
    ['个性化练习', '针对每个人的学习情况及进度提供个性化练习'],
  ];

  return (
    <Carousel className='w-full h-[400px] rounded-md drop-shadow-md' speed={3000} animation='fade' showArrow={false} indicatorType="columnar" theme='dark' indicatorPosition='right' autoPlay={true}>
      {
        imgList.map((src, index) => {
          return (
            <div key={index} className="bg-center bg-cover" style={{ backgroundImage: `url('${src}')` }}>
              <Space vertical align='start' spacing='medium' className='absolute bottom-[100px] left-[20px]'>
                <h1 className='text-4xl text-white underline decoration-yellow-400 drop-shadow-lg'>{textList[index][0]}</h1>
                <Space vertical align='start'>
                  <p className='text-xl text-white drop-shadow'>{textList[index][1]}</p>
                </Space>
              </Space>
            </div>
          );
        })
      }
    </Carousel>
  );
};