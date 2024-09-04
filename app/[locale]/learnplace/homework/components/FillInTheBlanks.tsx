import { Button, Input, Toast } from "@douyinfe/semi-ui";
import { useState } from "react";

export default function FillInTheBlanks({ content, showAnswer }: { content: any, showAnswer: boolean }) {
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

  return <div className="mt-6 w-1/2">
    <Input placeholder="请输入答案" onChange={handleInput} />
    {showAnswer && <div className='p-4 mt-4 border-4 border-orange-400 border-double'>
      ✅ 正确答案是：{content?.correct_answer?.text}
    </div>}
  </div>
}