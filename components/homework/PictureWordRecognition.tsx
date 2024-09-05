import { Radio, RadioGroup } from '@douyinfe/semi-ui';
import { useMemo } from 'react';
import Image from 'next/image';
import RenderPinyin from "./RenderPinyin";
import { SHOW_STUDENT_ANSWER_STATUS } from '@/utils/constants'

export default function PictureWordRecognition({ qid, content, showAnswer, studentAnswer, handleUpdateStudentAnswer, homeworkStatus }: { qid: any, content: any, showAnswer: boolean, studentAnswer: any, handleUpdateStudentAnswer: any, homeworkStatus: any }) {
  const initialVal = useMemo(() => {
    if (studentAnswer) {
      return studentAnswer[qid]
    }
    return ''
  }, [studentAnswer])

  const handleChange = (e: any) => {
    handleUpdateStudentAnswer(qid, e.target.value)
  }

  return <div className="w-full">
    <Image src={content?.img_url} alt="" width={200} height={200} className="my-4 max-w-80 rounded" />
    <RadioGroup disabled={homeworkStatus !== 'ASSIGNED'} className='w-[200px]' direction="vertical" type='card' value={SHOW_STUDENT_ANSWER_STATUS.includes(homeworkStatus) ? initialVal : ''} onChange={handleChange}>
      {
        content?.options.map((option: any, index: number) => {
          return <Radio style={{ alignItems: 'center' }} addonStyle={{ alignItems: 'flex-end' }} key={option.text} value={option.text}><span>{String.fromCharCode(65 + index)}.&nbsp;</span><RenderPinyin text={option.text} pinyin={option.pinyin}></RenderPinyin></Radio>
        })
      }
    </RadioGroup>
    {showAnswer && <div className='w-1/2 p-4 mt-4 border-4 border-orange-400 border-double'>
      ✅ 正确答案是：{content?.correct_answer?.text}
    </div>}
  </div>
};