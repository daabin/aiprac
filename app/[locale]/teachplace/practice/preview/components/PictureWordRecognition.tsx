import { Button, Radio, RadioGroup, Toast } from '@douyinfe/semi-ui';
import { useState } from 'react';

export default function PictureWordRecognition({ content }: { content: any }) {
  const [selectedValue, setSelectedValue] = useState<string>('')

  const handleChange = (e: any) => {
    setSelectedValue(e.target.value)
  }

  const handleCheck = () => {
    if (selectedValue === content?.correct_answer?.text) {
      Toast.success('回答正确')
    } else {
      Toast.error(`回答错误，正确答案是${content?.correct_answer?.text}(${content?.correct_answer?.pinyin})`)
    }
  }

  return <div className="w-full">
    <img src={content?.img_url} className="my-4 max-w-[100%]" />
    <RadioGroup type='card' onChange={handleChange}>
      {
        content?.options.map((option: any) => {
          return <Radio key={option.text} value={option.text}>{option.text}({option.pinyin})</Radio>
        })
      }
    </RadioGroup>
    <div className='flex justify-center mt-4'>
      <Button theme='solid' type='primary' onClick={handleCheck}>检查答案</Button>
    </div>
  </div>
};