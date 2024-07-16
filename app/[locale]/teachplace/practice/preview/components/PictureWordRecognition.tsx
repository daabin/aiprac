import { Button, Radio, RadioGroup, Toast } from '@douyinfe/semi-ui';
import { useState } from 'react';
import Image from 'next/image';
import RenderPinyin from "./RenderPinyin";

export default function PictureWordRecognition({ content }: { content: any }) {
  const [selectedValue, setSelectedValue] = useState<string>('')

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
    <Image src={content?.img_url} alt="" width={200} height={200} className="my-4 max-w-80" />
    <RadioGroup type='card' onChange={handleChange}>
      {
        content?.options.map((option: any, index: number) => {
          return <Radio style={{alignItems: 'center'}} addonStyle={{alignItems: 'flex-end'}} key={option.text} value={option.text}><span>{String.fromCharCode(65 + index)}.&nbsp;</span><RenderPinyin text={option.text} pinyin={option.pinyin}></RenderPinyin></Radio>
        })
      }
    </RadioGroup>
    <div className='flex justify-center mt-4'>
      <Button theme='solid' type='primary' onClick={handleCheck}>检查答案</Button>
    </div>
  </div>
};