'use client'
import { Breadcrumb, Steps } from '@douyinfe/semi-ui';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import StepFour from './components/StepFour';

export default function PracticeCreatePage() {
  const [step, setStep] = useState<number>(0)
  const [basicInfo, setBasicInfo] = useState<any>({})
  const [difficulty, setDifficulty] = useState<string>('')
  const [questionInfo, setQuestionInfo] = useState<any>([])
  const [pid, setPid] = useState<string>('')

  const next = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const last = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const Content = () => {
    return (
      <Fragment>
        {step === 0 && <StepOne basicInfo={basicInfo} setBasicInfo={setBasicInfo} next={next}/>}
        {step === 1 && <StepTwo difficulty={difficulty} setDifficulty={setDifficulty} next={next} last={last}/>}
        {step === 2 && <StepThree basicInfo={basicInfo} difficulty={difficulty} questionInfo={questionInfo} setQuestionInfo={setQuestionInfo} setPid={setPid} next={next} last={last}/>}
        {step === 3 && <StepFour questionInfo={questionInfo} pid={pid}/>}
      </Fragment>
    )
  }

  return (
    <section className='h-full flex flex-col'>
      <div className='mb-8'>
        <Breadcrumb compact={false} className="mb-4">
          <Breadcrumb.Item><Link href={'/teachplace/practice'}> 练习</Link></Breadcrumb.Item>
          <Breadcrumb.Item>AI一键出题</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Steps className='w-3/4 m-auto mb-8' type="basic" current={step}>
        <Steps.Step title="基础信息"/>
        <Steps.Step title="选择难度"/>
        <Steps.Step title="设置题目"/>
        <Steps.Step title="生成题目"/>
      </Steps>
      <Content />
    </section>
  )
}