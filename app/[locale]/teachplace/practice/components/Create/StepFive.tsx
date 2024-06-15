import { Typography, Divider, Table, Button, Toast, InputNumber } from '@douyinfe/semi-ui';
import { useMemo } from 'react';

const { Column } = Table;

export default function StepFour({ questionCount, setQuestionCount, total }: { questionCount: any[], setQuestionCount: any, total: number }) {
  const { Title } = Typography;

  const handleDel = (idx: number) => {
    console.log('idx', idx)
    if (questionCount.length === 1) {
      Toast.warning('至少保留一个题型')
      return;
    }

    const newQuestionCount = questionCount.filter((_: any, index: number) => index !== idx);
    console.log('newQuestionCount', newQuestionCount)
    setQuestionCount(newQuestionCount);
  }


  const updateCount = (idx: number, count: number) => {
    const newQuestionCount = questionCount.map((item, index) => {
      if (index === idx) {
        return {
          ...item,
          count
        }
      }
      return item
    })

    console.log('newQuestionCount', newQuestionCount)
    setQuestionCount(newQuestionCount)
  }

  return (
    <div>
      <div className='flex justify-between text-red-800 font-bold items-center'>
        <Title heading={5} style={{ color: 'rgb(127 29 29)' }}>注意：单个题出题量必须在1-10题之间，整套习题数量必须少于30题。</Title>
        <div className='px-2 py-1 border'>累计：{total} 题</div>
      </div>
      <Divider margin={16} />
      <Table dataSource={questionCount} rowKey='id' sticky>
        <Column title='序号' width={60} render={(value, record, index) => index + 1} />
        <Column title='类型' width={120} dataIndex="question_type" render={(value, record, index) => <span className='font-bold'>{record.question_type}</span>} />
        <Column title='题型解释' dataIndex="question_type_desc" />
        <Column title='数量' width={120} dataIndex="count" render={(value, record, index) => <InputNumber
          formatter={value => `${value}`.replace(/\D/g, '')}
          onNumberChange={number => updateCount(index, number)}
          defaultValue={record.count}
          min={1}
          max={10}
        />} />
        <Column title='操作' width={120} render={(value, record, index) => (
          <Button theme='light' type='danger' size='small' onClick={() => handleDel(index)}>删除该题型</Button>
        )} />
      </Table>
    </div>
  )
}