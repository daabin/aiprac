import { Button, Input, Toast } from "@douyinfe/semi-ui";
import { useState } from "react";

export default function FillInTheBlanks({ content }: { content: any }) {
  const [anser, setAnswer] = useState<string>('')

  const handleInput = (value: string) => {
    console.log('e.target.value------->', value)
    setAnswer(value)
  }

  const handleCheck = () => {
    console.log(content?.correct_answer)
    if (anser === content?.correct_answer?.text) {
      Toast.success('回答正确')
    } else {
      Toast.error(`回答错误，正确答案是：${content?.correct_answer?.text}`)
    }
  }

  return <div className="mt-20 w-2/3">
    <Input placeholder="请输入答案" onChange={handleInput} />
    <div className='flex justify-center mt-4'>
      <Button theme='solid' type='primary' onClick={handleCheck}>检查答案</Button>
    </div>
  </div>
}