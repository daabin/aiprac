import { Fragment, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Button, Form, Row, Table, Modal, Typography, Toast } from '@douyinfe/semi-ui';
import questionConfData from '@/utils/questionConfData'
import vocabularyConfData from '@/utils/vocabularyConfData';
import { Sparkles } from 'lucide-react';
import { AbilityEnabled, QuestionTypeEnabled } from '@/utils/constants'
import { generateUniqueID } from '@/utils/tools';

export default function StepOne({ basicInfo, difficulty, questionInfo, setQuestionInfo, setPid, next, last }: { basicInfo: any, difficulty: any, questionInfo: any, setQuestionInfo: any, setPid: any, next: any, last: any }) {
  const { Column } = Table;
  const { Title, Paragraph } = Typography;
  const formRef = useRef<any>(null);
  const [questionTypeOptions, setQuestionTypeOptions] = useState<string[]>([])
  const [saveLoading, setSaveLoading] = useState(false);

  const curDifficultyQuestionConfCache = useMemo(() => {
    return questionConfData.filter(question => question.level === difficulty)
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

  const handleSavePractice = async () => {
    if (questionInfo.length === 0) {
      Toast.error('请添加考察项目');
      return;
    }

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
      const { pid } = data.data[0];
      setPid(pid)
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
      setQuestionInfo([{ ...newQuestionInfo, question_level: difficulty, qid: generateUniqueID()}, ...questionInfo])
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
      <Form ref={formRef} layout='horizontal' className='pt-3' onSubmit={handleAdd}>
        {({ formState }) => (
          <Fragment>
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
            {
              formState.values.question_type === '看图认字' ? <Form.Select filter field="language_point" label='选择语言点' rules={[
                { required: true, message: '请选择' },
              ]} style={{ width: 150 }}>
                {
                  vocabularyConfData.map((item) => {
                    return <Form.Select.Option key={item.vocabulary} value={item.vocabulary}>{item.vocabulary}</Form.Select.Option>
                  })
                }
              </Form.Select> : <Form.Input field="language_point" label='输入语言点' rules={[
                { required: true, message: '请输入' },
              ]} style={{ width: 300 }} />
            }
            <Row className='mt-6'>
              <Button type="primary" theme='solid' htmlType="submit" className="mx-4">
                新增
              </Button>
              <Link  target='_blank' href={'https://qum9c5nv4n.feishu.cn/docx/OcAyd7sI9oWhQOxXDBUc7jmIncc'}><Button>帮助</Button></Link>
            </Row>
          </Fragment>
        )}
      </Form>
      <Table dataSource={questionInfo} rowKey='id' sticky className='mt-6' pagination={{ pageSize: 5 }} bordered={true}>
        <Column title='题号' width={120}  render={(value, record, index) => (
          <span>{index + 1}</span>
        )}/>
        <Column title='能力项' width={120} dataIndex="question_ability" />
        <Column title='题型' width={150} dataIndex="question_type" />
        <Column title='题型解释' width={100} render={(value, record, index) => (
          <Button theme='borderless' type='secondary' size='small' onClick={() => handleShowExample(record)}>查看示例</Button>
        )} />
        <Column title='考察语言点' dataIndex="language_point" />
        <Column title='操作' width={120} render={(value, record, index) => (
          <Button theme='light' type='danger' size='small' onClick={() => handleDel(index)}>移除</Button>
        )} />
      </Table>
      <div className="flex justify-end py-4">
        <Button size="large" theme="light" className="mr-2" onClick={handleLast}>上一步</Button>
        <Button size="large" theme="solid" onClick={handleSavePractice} icon={<Sparkles />} loading={saveLoading}>一键出题</Button>
      </div>
    </section >
  )
}