import { Button, Toast } from "@douyinfe/semi-ui";
import { useEffect, useMemo, useState } from "react";
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'
import { IconStop, IconDisc, IconPause, IconVolume1 } from '@douyinfe/semi-icons'
import RenderPinyin from "./RenderPinyin";
import { generateUniqueID } from '@/utils/tools';

export default function OralPronunciation({ qid, content, showAnswer, studentAnswer, handleUpdateStudentAnswer, homeworkStatus }: { qid: any, content: any, showAnswer: boolean, studentAnswer: any, handleUpdateStudentAnswer: any, homeworkStatus: any }) {
  const [recordState, setRecordState] = useState<any>(RecordState.STOP)
  const [audioData, setAudioData] = useState<any>(null)
  const [uploading, setUploading] = useState<boolean>(false)

  useEffect(() => {
    if (studentAnswer[qid]) {
      getAudioUrl(studentAnswer[qid])
    }
  }, [studentAnswer])

  const handleStart = () => {
    setRecordState(RecordState.START)
  }

  const handleStop = () => {
    setRecordState(RecordState.STOP)
  }

  const handlePause = () => {
    setRecordState(RecordState.PAUSE)
  }

  const onStop = async (recordData: any) => {
    console.log('recordData', recordData)
    if (!recordData?.blob) {
      return
    }
    setUploading(true)
    const formData = new FormData()
    formData.append('file', recordData?.blob);
    formData.append('uuid', generateUniqueID());
    const res = await fetch('/api/storage/homework', {
      method: 'POST',
      body: formData,
    })
    const resData = await res.json()

    if (resData?.data?.path) {
      handleUpdateStudentAnswer(qid, resData?.data?.path)
      await getAudioUrl(resData?.data?.path)
    } else {
      Toast.error('上传失败, 请重试')
    }

    setUploading(false)
    Toast.success('录制成功')
  }

  const getAudioUrl = async (path: any) => {
    const res = await fetch(`/api/storage?path=${path}`, {
      method: 'GET',
    })
    const data = await res.json();

    if (!data?.data?.signedUrl) {
      return
    }
    setAudioData(data?.data?.signedUrl)
  }


  return <div className="flex flex-col items-center pt-4">
    <div className="self-start my-2 p-2 text-xl font-bold text-[#ff9100]"><IconVolume1 />
      {
        typeof content?.question === 'string' ? <span>{content?.question}</span> : <RenderPinyin text={content?.question?.text} pinyin={content?.question?.pinyin}></RenderPinyin>
      }
    </div>
    {homeworkStatus === 'ASSIGNED' && <AudioReactRecorder state={recordState} canvasWidth={500} backgroundColor="#f1f3f5" foregroundColor="#ff7900" canvasHeight={150} onStop={onStop} />}
    {homeworkStatus === 'ASSIGNED' && <div className="flex gap-4 justify-center my-6">
      <Button size="small" onClick={handleStart} icon={<IconDisc></IconDisc>}>开始录制</Button>
      <Button size="small" onClick={handlePause} icon={<IconPause></IconPause>}>暂停录制</Button>
      <Button size="small" loading={uploading} onClick={handleStop} icon={<IconStop></IconStop>}>结束录制</Button>
    </div>}
    <div className="flex flex-col items-center">
      <audio
        id='audio'
        controls
        src={audioData || ''}
      ></audio>
    </div>
  </div>
}