import { Fragment, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StaticImageData } from 'next/image';
import { Button, ButtonGroup, Form, Row, Table, Modal, Toast } from '@douyinfe/semi-ui';
import questionConfData from '@/utils/questionConfData'
import vocabularyConfData from '@/utils/vocabularyConfData';
import { Sparkles } from 'lucide-react';
import { AbilityEnabled, QuestionTypeEnabled } from '@/utils/constants'
import { generateUniqueID } from '@/utils/tools';
import { IconDelete, IconArrowDown, IconArrowUp } from '@douyinfe/semi-icons';
import Exp1 from '@/public/exp-1.png';
import Exp2 from '@/public/exp-2.png';
import Exp3 from '@/public/exp-3.png';
import Exp4 from '@/public/exp-4.png';
import Exp5 from '@/public/exp-5.png';

export default function StepThree({ basicInfo, difficulty, questionInfo, setQuestionInfo, setPid, next, last }: { basicInfo: any, difficulty: any, questionInfo: any, setQuestionInfo: any, setPid: any, next: any, last: any }) {
  const { Column } = Table;
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
      Toast.error('请添加考查项目');
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
      setQuestionInfo([...questionInfo, { ...newQuestionInfo, question_level: difficulty, qid: generateUniqueID() }])
    })
  }

  const handleDel = (record: any) => {
    const newQuestionInfo = questionInfo.filter((item: any) => item.qid !== record.qid)
    setQuestionInfo(newQuestionInfo)
  }

  const handleUp = (index: number) => {
    const newQuestionInfo = [...questionInfo]
    const temp = newQuestionInfo[index]
    newQuestionInfo[index] = newQuestionInfo[index - 1]
    newQuestionInfo[index - 1] = temp
    setQuestionInfo(newQuestionInfo)
  }

  const handleDown = (index: number) => {
    const newQuestionInfo = [...questionInfo]
    const temp = newQuestionInfo[index]
    newQuestionInfo[index] = newQuestionInfo[index + 1]
    newQuestionInfo[index + 1] = temp
    setQuestionInfo(newQuestionInfo)
  }

  const handleShowExample = (record: any) => {
    const { question_type } = record;
    let imgSrc: StaticImageData = Exp1;
    switch (question_type) {
      case '看图认字':
        imgSrc = Exp5;
        break;
      case '词汇匹配（中-英）':
        imgSrc = Exp1;
        break;
      case '字词填空':
        imgSrc = Exp4;
        break;
      case '听力选择':
        imgSrc = Exp2;
        break;
      case '口语发音':
        imgSrc = Exp3;
        break;
      default:
        break;
    }
    Modal.info({
      title: '示例', 
      bodyStyle: { margin: 0 },
      content: <div>
        <Image src={imgSrc} alt='示例'/>
      </div>
      , hasCancel: false, footer: null
    });
  }

  return (
    <section className='flex-1 flex flex-col justify-between'>
      <Form ref={formRef} layout='horizontal' className='pt-3' onSubmit={handleAdd}>
        {({ formState }) => (
          <Fragment>
            <Form.Select field="question_ability" label='选择考查能力项' rules={[
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
            ]} style={{ width: 200 }} onChange={handleTypeSelect}>
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
                新增题目
              </Button>
              <Link target='_blank' href={'https://qum9c5nv4n.feishu.cn/docx/OcAyd7sI9oWhQOxXDBUc7jmIncc'}><Button>操作手册</Button></Link>
            </Row>
          </Fragment>
        )}
      </Form>
      <Table dataSource={questionInfo} rowKey='id' sticky className='mt-6' pagination={{ pageSize: 8 }} bordered={true}>
        <Column title='题号' width={100} render={(value, record, index) => (
          <span>{index + 1}</span>
        )} />
        <Column title='考查能力' width={100} dataIndex="question_ability" />
        <Column title='考查题型' width={150} dataIndex="question_type" />
        <Column title='效果示例' width={100} render={(value, record, index) => (
          <Button theme='borderless' type='secondary' size='small' onClick={() => handleShowExample(record)}>查看</Button>
        )} />
        <Column title='考查语言点' dataIndex="language_point" />
        <Column title='操作' width={160} render={(value, record, index) => (
          <ButtonGroup size='small'>
            <Button theme='light' type='danger' icon={<IconDelete />} size='small' onClick={() => handleDel(record)}></Button>
            <Button disabled={index === 0} theme='light' icon={<IconArrowUp />} size='small' onClick={() => handleUp(index)}></Button>
            <Button disabled={index === questionInfo.length - 1 } theme='light' icon={<IconArrowDown />} size='small' onClick={() => handleDown(index)}></Button>
          </ButtonGroup>
        )} />
      </Table>
      <div className="flex justify-end py-4">
        <Button size="large" theme="light" className="mr-2" onClick={handleLast}>上一步</Button>
        <Button size="large" theme="solid" onClick={handleSavePractice} icon={<Sparkles />} loading={saveLoading}>一键出题</Button>
      </div>
    </section >
  )
}