import { useMemo, useRef, useState } from 'react';
import { Button, Form, Row, Table, Modal, Typography, Toast } from '@douyinfe/semi-ui';
import QuestionConf from '@/utils/questionConfData'
import { WandSparkles } from 'lucide-react';
import { AbilityEnabled, QuestionTypeEnabled } from '@/utils/constants'

export default function StepOne({ basicInfo, difficulty, next, last }: { basicInfo: any, difficulty: any, next: any, last: any }) {
  const { Column } = Table;
  const { Title, Paragraph } = Typography;
  const formRef = useRef<any>(null);
  const [questionTypeOptions, setQuestionTypeOptions] = useState<string[]>([])
  const [questionInfo, setQuestionInfo] = useState<any>([])
  const [saveLoading, setSaveLoading] = useState(false);

  const curDifficultyQuestionConfCache = useMemo(() => {
    return QuestionConf.filter(question => question.level === difficulty)
  }, [difficulty])

  const questionAbilityOptions = useMemo(() => {
    if (curDifficultyQuestionConfCache.length > 0) {
      const abilities: string[] = [];
      curDifficultyQuestionConfCache.forEach(question => {
        if (!abilities.includes(question.ability)) {
          abilities.push(question.ability);
        }
      })

      return abilities
    }
  }, [curDifficultyQuestionConfCache])

  const handleLast = () => {
    last()
  }

  const handleGen = async () => {
    setSaveLoading(true)
    const res = await fetch('/api/practice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...basicInfo, settings: questionInfo }),
    });
    setSaveLoading(false)
    const data = await res.json();

    if (data?.error) {
      Toast.error('提交失败，请稍后再试');
    } else {
      next()
    }
  }

  const handleAbilitySelect = (value: any) => {
    formRef.current.formApi.setValues({ question_type: '', language_point: '' });

    const types: string[] = [];
    curDifficultyQuestionConfCache.forEach(question => {
      if (question.ability === value) {
        if (!types.includes(question.question_type)) {
          types.push(question.question_type);
        }
      }
    })

    setQuestionTypeOptions(types)
  }

  const handleTypeSelect = () => {
    formRef.current.formApi.setValue('language_point', '')
  }

  const handleAdd = () => {
    formRef.current.formApi.validate().then((valid: boolean) => {
      if (!valid) {
        return;
      }
      const newQuestionInfo = formRef.current.formApi.getValues()
      setQuestionInfo([...questionInfo, { ...newQuestionInfo, question_id: questionInfo.length + 1, question_level: difficulty }])
    })
  }

  const handleDel = (index: number) => {
    const newQuestionInfo = questionInfo.filter((_: any, i: number) => i !== index)
    setQuestionInfo(newQuestionInfo)
  }

  const handleShowExample = (record: any) => {
    const { question_ability, question_type } = record;
    const example = curDifficultyQuestionConfCache.find(question => question.ability === question_ability && question.question_type === question_type);

    Modal.info({
      title: '示例', content: <div className='mb-6'>
        <Title heading={6}>题型解释</Title>
        <Paragraph spacing='extended'>{example?.question_type_desc}</Paragraph>
        <Title heading={6} style={{ marginTop: 16 }}>举例</Title>
        <Paragraph spacing='extended'>{example?.question_type_example}</Paragraph>
      </div>
      , hasCancel: false, footer: null
    });
  }

  return (
    <section className='flex-1 flex flex-col justify-between'>
      <div>

        <Form ref={formRef} layout='horizontal' className='pt-3' onSubmit={handleAdd}>
          <Form.Select field="question_ability" label='选择考察能力项' rules={[
            { required: true, message: '请选择' },
          ]} style={{ width: 150 }} onChange={handleAbilitySelect}>
            {
              questionAbilityOptions && questionAbilityOptions.map((ability: string) => {
                return <Form.Select.Option disabled={!AbilityEnabled.includes(ability)} key={ability} value={ability}>{ability}{!AbilityEnabled.includes(ability) && '（暂未支持）'}</Form.Select.Option>
              })
            }
          </Form.Select>
          <Form.Select field="question_type" label='选择题型' rules={[
            { required: true, message: '请选择' },
          ]} style={{ width: 150 }} onChange={handleTypeSelect}>
            {
              questionTypeOptions && questionTypeOptions.map((type: string) => {
                return <Form.Select.Option disabled={!QuestionTypeEnabled.includes(type)} key={type} value={type}>{type}{!QuestionTypeEnabled.includes(type) && '（暂未支持）'}</Form.Select.Option>
              })
            }
          </Form.Select>
          <Form.Input field="language_point" label='输入语言点' rules={[
            { required: true, message: '请输入' },
          ]} style={{ width: 300 }} />
          <Row className='mt-6'>
            <Button type="primary" theme='solid' htmlType="submit" className="mx-4">
              新增
            </Button>
            <Button>帮助</Button>
          </Row>
        </Form>
        <Table dataSource={questionInfo} rowKey='id' sticky className='mt-6' pagination={{ pageSize: 5 }} bordered={true}>
          <Column title='题号' width={120} dataIndex="question_id" />
          <Column title='能力项' width={150} dataIndex="question_ability" />
          <Column title='题型' width={200} dataIndex="question_type" />
          <Column title='题型解释' width={120} render={(value, record, index) => (
            <Button theme='borderless' type='secondary' size='small' onClick={() => handleShowExample(record)}>查看示例</Button>
          )} />
          <Column title='考察语言点' dataIndex="language_point" />
          <Column title='操作' width={120} render={(value, record, index) => (
            <Button theme='light' type='danger' size='small' onClick={() => handleDel(index)}>删除该题型</Button>
          )} />
        </Table>
      </div>
      <div className="flex justify-end py-4">
        <Button size="large" theme="light" className="mr-2" onClick={handleLast}>上一步</Button>
        <Button size="large" theme="solid" onClick={handleGen} icon={<WandSparkles />} loading={saveLoading}>一键出题</Button>
      </div>
    </section >
  )
}