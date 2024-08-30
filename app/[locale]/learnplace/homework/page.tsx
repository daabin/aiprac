'use client';

import { useState } from "react";
import { Typography, RadioGroup, Radio } from "@douyinfe/semi-ui"

export default function HomeworkPage() {
  const { Title } = Typography
  const [filterType, setFilterType] = useState('todo')

  return <div className="max-w-[1168px] mx-auto">
    <Title heading={1}>我的作业</Title>
    <RadioGroup
      onChange={e => setFilterType(e.target.value)}
      value={filterType}
      type="button"
      buttonSize='large'
      style={{
        marginTop: 20,
        display: 'flex',
        width: 300,
        justifyContent: 'space-between',
      }}
    >
      <Radio value={'todo'}>待完成</Radio>
      <Radio value={'done'}>已完成</Radio>
      <Radio value={'all'}>全部</Radio>
    </RadioGroup>
  </div>
}