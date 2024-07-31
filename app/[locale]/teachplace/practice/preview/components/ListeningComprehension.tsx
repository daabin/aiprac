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

    if(!data?.data?.signedUrl) {
      Toast.error('获取音频文件失败')
      return
    }
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
    <audio className='my-6' controls src={audioUrl}></audio>
    <RadioGroup type='card' onChange={handleChange}>
      {
        content?.options?.map((option: any, index: number) => {
          return <Radio style={{alignItems: 'center'}} addonStyle={{alignItems: 'flex-end'}} key={option.text} value={option.text}><span>{String.fromCharCode(65 + index)}.&nbsp;</span><RenderPinyin text={option.text} pinyin={option.pinyin}></RenderPinyin></Radio>
        })
      }
    </RadioGroup>
    <div className='w-1/2 p-4 mt-4 border-4 border-orange-400 border-double'>
      ✅ 正确答案是：{content?.correct_answer?.text}
    </div>
  </div>
}