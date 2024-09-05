import { Button, Radio, RadioGroup, Toast } from '@douyinfe/semi-ui';
import { useEffect, useMemo, useState } from 'react';
import RenderPinyin from "./RenderPinyin";
import { SHOW_STUDENT_ANSWER_STATUS } from '@/utils/constants'

export default function ListeningComprehension({ qid, content, showAnswer, studentAnswer, handleUpdateStudentAnswer, homeworkStatus }: { qid: any, content: any, showAnswer: boolean, studentAnswer: any, handleUpdateStudentAnswer: any, homeworkStatus: any }) {
  const [audioUrl, setAudioUrl] = useState<string>('')

  const initialVal = useMemo(() => {
    if (studentAnswer) {
      return studentAnswer[qid]
    }
    return ''
  }, [studentAnswer])

  useEffect(() => {
    getAudioUrl()
  }, [content])

  const getAudioUrl = async () => {
    const res = await fetch(`/api/storage?path=${content?.supabase_path}`, {
      method: 'GET',
    })
    const data = await res.json();

    if (!data?.data?.signedUrl) {
      Toast.error('获取音频文件失败')
      return
    }
    setAudioUrl(data?.data?.signedUrl)
  }

  const handleChange = (e: any) => {
    handleUpdateStudentAnswer(qid, e.target.value)
  }

  return <div className="w-full">
    <audio className='my-6' controls src={audioUrl}></audio>
    <RadioGroup disabled={homeworkStatus !== 'ASSIGNED'} type='card' className='w-[200px]' direction="vertical" value={SHOW_STUDENT_ANSWER_STATUS.includes(homeworkStatus) ? initialVal : ''} onChange={handleChange}>
      {
        content?.options?.map((option: any, index: number) => {
          return <Radio style={{ alignItems: 'center' }} addonStyle={{ alignItems: 'flex-end' }} key={option.text} value={option.text}><span>{String.fromCharCode(65 + index)}.&nbsp;</span><RenderPinyin text={option.text} pinyin={option.pinyin}></RenderPinyin></Radio>
        })
      }
    </RadioGroup>
    {showAnswer && <div className='w-1/2 p-4 mt-4 border-4 border-orange-400 border-double'>
      ✅ 正确答案是：{content?.correct_answer?.text}
    </div>}
  </div>
}