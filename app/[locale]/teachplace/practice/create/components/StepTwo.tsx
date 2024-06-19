
'use client'
import { useRef } from 'react';
import { Button, Form } from '@douyinfe/semi-ui';
import { QuestionDifficulty } from '@/utils/constants'

export default function StepTwo({ difficulty, setDifficulty, next, last }: { difficulty: any, setDifficulty: any, next: any, last: any }) {
  const formRef = useRef<any>(null);

  const handleLast = () => {
    last()
  }

  const handleNext = () => {
    formRef.current.formApi.validate().then((valid: boolean) => {
      if (!valid) {
        return;
      }
      const { difficulty } = formRef.current.formApi.getValues()
      console.log(difficulty, 'difficulty')
      setDifficulty(difficulty)
      next();
    })
  }

  return (
    <section className='flex-1 flex flex-col justify-between'>
      <Form ref={formRef} initValues={{difficulty}}>
        <Form.RadioGroup direction="vertical" field="difficulty" label='请选择本次练习的难度' rules={[
          { required: true, message: '必须选择难度' }
        ]}>
          {
            QuestionDifficulty.map((item) => {
              return <Form.Radio key={item} value={item}>{item}</Form.Radio>
            })
          }
        </Form.RadioGroup>
      </Form>
      <div className="flex justify-end py-4">
        <Button size="large" theme="light" className="mr-2" onClick={handleLast}>上一步</Button>
        <Button size="large" theme="solid" onClick={handleNext}>下一步</Button>
      </div>
    </section>
  )
}