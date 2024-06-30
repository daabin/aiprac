'use client'
import { Typography, Button, Toast } from '@douyinfe/semi-ui';
import { Spin } from '@douyinfe/semi-ui';
import Link from 'next/link';
import { IconLoading } from '@douyinfe/semi-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PreviewStatus } from '@/utils/constants'
import VocabularyConfData from '@/utils/vocabularyConfData';

export default function StepOne({ questionInfo, pid }: { questionInfo: any, pid: string }) {
  const { Title } = Typography;
  const [completed, setCompleted] = useState<boolean>(false)
  const [genStatus, setGenStatus] = useState<string>('')
  const countRef = useRef<number>(0)

  useEffect(() => {
    if (pid && questionInfo?.length > 0) {
      handleGen()
    }
  }, [questionInfo, pid])


  const genCount = useMemo(() => {
    return countRef.current
  }, [countRef.current])

  const composeRequest = async (question: any) => {
    return fetch('/api/gen', {
      method: 'POST',
      body: JSON.stringify(question),
    }).then((res) => {
      countRef.current += 1
      return res.json()
    })
  }

  const handleGen = async () => {
    console.log('questionInfo ----', questionInfo)

    const questionInfoCopy = JSON.parse(JSON.stringify(questionInfo))
    questionInfoCopy.forEach((question: any) => {
      question.gen_status = 0
      question.pid = pid
    })

    const requestArr: any = []
    questionInfoCopy.forEach((question: any) => {
      requestArr.push(composeRequest(question))
    })

    const results = await Promise.allSettled(requestArr)

    for (let i = 0; i < results.length; i++) {
      if (results[i].status === 'fulfilled') {
        const { value } = results[i] as any

        if (!value?.error && value?.content) {
          questionInfoCopy[i].content = value?.content || {}
          questionInfoCopy[i].token = value?.token || 0
          questionInfoCopy[i].gen_status = 1

          if (questionInfoCopy[i]?.question_type === '看图认字') {
            const target = VocabularyConfData.find((item: any) => item.vocabulary === questionInfoCopy[i]?.language_point)
            questionInfoCopy[i].content.img_url = target?.img_url || ''
          } else if (questionInfoCopy[i]?.question_type === '听力选择') {
            questionInfoCopy[i].content.audio_url = value?.audio_url || ''

            const res = await fetch('/api/storage', {
              method: 'POST',
              body: JSON.stringify({ audio_url: value?.audio_url, qid: questionInfoCopy[i]?.qid }),
            })
            const resData = await res.json()
    
            console.log('upload audio res------->', resData?.data?.path);
    
            if (resData?.data?.path) {
              questionInfoCopy[i].content.supabase_path = resData?.data?.path
            } else {
              questionInfoCopy[i].gen_status = 0
            }
          }
        }
      }
    }

    await handleSave(questionInfoCopy)
  }


  const handleSave = async (questionInfoCopy: any[]) => {
    console.log('do save ----->')
    const questionSave = await fetch('/api/questions', {
      method: 'POST',
      body: JSON.stringify(questionInfoCopy),
    })

    const questionSaveData = await questionSave.json()

    if (questionSaveData.error) {
      console.log('questionSaveData.error ---->', questionSaveData.error)
    }

    // 更新 practice 表的 gen_status
    const successNum = questionInfoCopy.filter((item: any) => item.gen_status === 1).length
    const genStatus = successNum === questionInfoCopy.length ? '成功' : successNum === 0 ? '失败' : '部分成功'
    setGenStatus(genStatus)

    const updatePracticeGenStatus = await fetch('/api/practice', {
      method: 'PUT',
      body: JSON.stringify({ pid, gen_status: genStatus }),
    })

    const updatePracticeGenStatusData = await updatePracticeGenStatus.json()

    if (updatePracticeGenStatusData.error) {
      Toast.warning('更新练习状态失败');
    }

    setCompleted(true)
  }


  return (
    <div className="h-full flex flex-col items-center mt-10">
      {
        !completed && <div className='text-center'>
          <Spin indicator={<IconLoading size="extra-large" />} />
          <Title heading={2} style={{ margin: "20px 0", color: '#ff7900' }}>题目生成中......</Title>
          <Title heading={3} style={{ color: '#7f1d1d' }}>请勿离开当前页面！</Title>
        </div>
      }
      {
        completed && <div className='text-center'>
          <Title heading={2} style={{ margin: "20px 0", color: '#ff7900' }}>已完成</Title>
          <Title heading={3} style={{ color: '#7f1d1d' }}>生成的题目已经保存到题库中，你可以在练习主页查看</Title>
        </div>
      }
      <div className='mt-6'>
        {
          completed && <Link href={'/teachplace/practice'}><Button size="large" theme="light">返回练习主页</Button></Link>
        }
        {
          PreviewStatus.includes(genStatus) && <Link href={`/teachplace/practice/preview?pid=${pid}`}><Button size="large" theme="solid" className='ml-4'>预览题目</Button></Link>
        }
      </div>
    </div >
  )
}