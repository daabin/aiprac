import { Typography, Divider, Table, Button, Toast } from '@douyinfe/semi-ui';

const { Column } = Table;

export default function StepFour({ questionTypes, setQuestionTypes }: { questionTypes: any[], setQuestionTypes: any }) {
  const { Title } = Typography;

  const handleDel = (idx: number) => {
    console.log('idx', idx)
    if (questionTypes.length === 1) {
      Toast.warning('至少保留一个题型')
      return;
    }

    const newKnowledgePoints = questionTypes.filter((_: any, index: number) => index !== idx);
    console.log('newKnowledgePoints', newKnowledgePoints)
    setQuestionTypes(newKnowledgePoints);
  }

  return (
    <div>
      <Title heading={5} style={{color: 'rgb(127 29 29)'}}>系统根据你选择的考察能力项、题目难度，自动为你推荐如下题型</Title>
      <Divider margin={16} />
      <Table dataSource={questionTypes} rowKey='id' sticky>
        <Column title='序号' width={60} render={(value, record, index) => index + 1} />
        <Column title='类型' width={120} dataIndex="question_type" render={(value, record, index) => <span className='font-bold'>{record.question_type}</span>} />
        <Column title='题型解释' dataIndex="question_type_desc" />
        <Column title='样例' dataIndex="question_type_example" />
        <Column title='操作' width={120} render={(value, record, index) => (
          <Button theme='light' type='danger' size='small' onClick={() => handleDel(index)}>删除该题型</Button>
        )} />
      </Table>
    </div>
  )
}