import { Button, Toast } from "@douyinfe/semi-ui";
import { useState } from "react";
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'
import { IconStop, IconDisc, IconPause, IconVolume1 } from '@douyinfe/semi-icons'
import RenderPinyin from "./RenderPinyin";

export default function OralPronunciation({ content }: { content: any }) {
  const [recordState, setRecordState] = useState<any>(RecordState.STOP)
  const [audioData, setAudioData] = useState<any>(null)

  const handleStart = () => {
    setRecordState(RecordState.START)
  }

  const handleStop = () => {
    setRecordState(RecordState.STOP)
  }

  const handlePause = () => {
    setRecordState(RecordState.PAUSE)
  }

  const onStop = (audioData: any) => {
    setAudioData(audioData)
    Toast.success('录制成功')
  }


  return <div className="flex flex-col items-center pt-4">
    <div className="self-start my-2 p-2 text-xl font-bold text-[#ff9100]"><IconVolume1 />
      {
        typeof content?.question === 'string' ? <span>{content?.question}</span> : <RenderPinyin text={content?.question?.question_text?.text} pinyin={content?.question?.question_text?.pinyin}></RenderPinyin>
      }
    </div>
    <AudioReactRecorder state={recordState} canvasWidth={500} backgroundColor="#f1f3f5" foregroundColor="#ff7900" canvasHeight={150} onStop={onStop} />
    <div className="flex gap-4 justify-center my-6">
      <Button size="small" onClick={handleStart} icon={<IconDisc></IconDisc>}>开始录制</Button>
      <Button size="small" onClick={handlePause} icon={<IconPause></IconPause>}>暂停录制</Button>
      <Button size="small" onClick={handleStop} icon={<IconStop></IconStop>}>结束录制</Button>
    </div>
    <div className="flex flex-col items-center">
      <audio
        id='audio'
        controls
        src={audioData?.url || ''}
      ></audio>
    </div>
  </div>
}