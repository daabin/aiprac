
'use client'
import React from 'react';
import { Carousel, Typography, Space } from '@douyinfe/semi-ui';

export default function Banner() {
  const { Title, Paragraph } = Typography;

  const colorStyle = {
    color: '#1C1F23'
  };

  const imgList = [
    '/bg-1.png',
    '/bg-2.png',
    '/bg-3.png',
  ];

  const textList = [
    ['智能化布置作业', '从讲义到练习作业', '快速生成个性化练习作业'],
    ['智能批改作业', '不止打分，更有学习建议', '客观题准确率高达 90%'],
    ['个性化练习', '查漏补缺，针对性训练', '针对每个人的学习情况及进度提供个性化练习'],
  ];

  return (
    <Carousel className='w-full h-[400px] rounded-md drop-shadow-md' speed={3000} animation='fade' showArrow={false} indicatorType="columnar" theme='dark' indicatorPosition='right' autoPlay={true}>
      {
        imgList.map((src, index) => {
          return (
            <div key={index} className="bg-center bg-cover" style={{ backgroundImage: `url('${src}')` }}>
              <Space vertical align='start' spacing='medium' className='absolute top-[100px] left-[100px]'>
                <Title heading={2}>{textList[index][0]}</Title>
                <Space vertical align='start'>
                  <Title heading={4}>{textList[index][1]}</Title>
                  <Paragraph>{textList[index][2]}</Paragraph>
                </Space>
              </Space>
            </div>
          );
        })
      }
    </Carousel>
  );
};