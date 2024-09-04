import { Input } from "@douyinfe/semi-ui";
import { useMemo } from "react";

export default function FillInTheBlanks({ qid, content, showAnswer, studentAnswer, handleUpdateStudentAnswer }: { qid: any, content: any, showAnswer: boolean, studentAnswer: any, handleUpdateStudentAnswer: any }) {
  const initialVal = useMemo(() => {
    if (studentAnswer) {
      return studentAnswer[qid]
    }
    return ''
  }, [studentAnswer])

  const handleInput = (value: string) => {
    handleUpdateStudentAnswer(qid, value)
  }

  return <div className="mt-6 w-1/2">
    <Input placeholder="请输入答案" defaultValue={initialVal} onChange={handleInput} />
    {showAnswer && <div className='p-4 mt-4 border-4 border-orange-400 border-double'>
      ✅ 正确答案是：{content?.correct_answer?.text}
    </div>}
  </div>
}