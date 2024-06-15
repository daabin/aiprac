
'use client'
import { useMemo } from 'react';
import { RadioGroup, Radio } from '@douyinfe/semi-ui';
import { QuestionDifficulty } from '@/utils/constants'

export default function StepTwo({ difficulty, setDifficulty }: { difficulty: any, setDifficulty: any }) {

  const defaultValue = useMemo(() => {
    return difficulty.value
  }, [difficulty])

  const handleSelect = (e: any) => {

    const selected = QuestionDifficulty.find((item) => item.value === e?.target?.value)
    setDifficulty(selected)
  }

  return (
    <div>
      <RadioGroup direction="vertical" onChange={(e: any) => handleSelect(e)} value={defaultValue}>
        {
          QuestionDifficulty.map((item) => {
            return <Radio key={item.value} value={item.value}>{item.label}</Radio>
          })
        }
      </RadioGroup>
    </div>
  )
}