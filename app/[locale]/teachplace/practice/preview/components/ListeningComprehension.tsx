import { Button, Radio, RadioGroup, Toast } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import RenderPinyin from "./RenderPinyin";

export default function ListeningComprehension({ content }: { content: any }) {
  const [selectedValue, setSelectedValue] = useState<string>('')
  const [audioUrl, setAudioUrl] = useState<string>('')

  useEffect(() => {
    getAudioUrl()
  }, [content])

  const getAudioUrl = async () => {
    const res = await fetch(`/api/storage?path=${content?.supabase_path}`, {
      method: 'GET',
    })
    const data = await res.json();

    console.log('get audio url res------->', data)
    setAudioUrl(data?.data?.signedUrl)
  }

  const handleChange = (e: any) => {
    setSelectedValue(e.target.value)
  }

  const handleCheck = () => {
    if (selectedValue === content?.correct_answer?.text) {
      Toast.success('回答正确')
    } else {
      Toast.error(`回答错误，正确答案是：${content?.correct_answer?.text}`)
    }
  }

  return <div className="w-full">
    {audioUrl && <audio className='my-6' controls src={audioUrl}></audio>}
    <RadioGroup type='card' onChange={handleChange}>
      {
        content?.options?.map((option: any) => {
          return <Radio key={option.text} value={option.text}><RenderPinyin text={option.text} pinyin={option.pinyin}></RenderPinyin></Radio>
        })
      }
    </RadioGroup>
    <div className='flex justify-center mt-4'>
      <Button theme='solid' type='primary' onClick={handleCheck}>检查答案</Button>
    </div>
  </div>
}