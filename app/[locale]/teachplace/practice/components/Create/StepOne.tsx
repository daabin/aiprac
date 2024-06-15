import { Button, Input, InputGroup, Select, Table, Divider, Toast } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { KnowledgePointsTypes } from '@/utils/constants'

const { Column } = Table;

export default function StepOne({ knowledgePoints, setKnowledgePoints }: { knowledgePoints: any, setKnowledgePoints: any }) {
  const [type, setType] = useState<number>(1);
  const [content, setContent] = useState<string>('');

  const handleDel = (idx: number) => {
    console.log('idx', idx)
    const newKnowledgePoints = knowledgePoints.filter((_: any, index: number) => index !== idx);
    console.log('newKnowledgePoints', newKnowledgePoints)
    setKnowledgePoints(newKnowledgePoints);
  }

  const handleAdd = () => {
    if (content.length === 0) {
      Toast.warning('请输入内容')
      return;
    };
    console.log('type', type, 'content', content)
    const typeObj = KnowledgePointsTypes.find((item) => item.value === type);

    const newKnowledgePoints = [...knowledgePoints, {
      type: typeObj,
      content
    }];

    console.log('newKnowledgePoints', newKnowledgePoints)
    setKnowledgePoints(newKnowledgePoints);
  }

  return (
    <div className='flex flex-col'>
      <div className='flex'>
        <InputGroup>
          <Select style={{ width: '100px' }} defaultValue={KnowledgePointsTypes[0].value} onChange={(val: any) => setType(val)}>
            {
              KnowledgePointsTypes.map((item) => {
                return <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
              })
            }
          </Select>
          <Input
            placeholder='请输入内容'
            style={{ width: 300 }}
            className='mx-2'
            validateStatus='success'
            value={content}
            onChange={(txt) => setContent(txt)}
          >
          </Input>
        </InputGroup>
        <Button theme='solid'
          type='primary' onClick={handleAdd}>新增</Button>
        <Button theme='light' type='primary' className='ml-2'>查看语法点列表</Button>
      </div>
      <Divider margin={16} />
      <Table dataSource={knowledgePoints} rowKey='id' sticky>
        <Column title='序号' width={60} render={(value, record, index) => index + 1} />
        <Column title='类型' width={120} dataIndex="type" render={(value, record, index) => <span className='font-bold'>{record.type.label}</span>} />
        <Column title='内容' dataIndex='content' />
        <Column title='操作' width={120} render={(value, record, index) => (
          <Button theme='light' type='danger' size='small' onClick={() => handleDel(index)}>删除</Button>
        )} />
      </Table>
    </div>
  )
}