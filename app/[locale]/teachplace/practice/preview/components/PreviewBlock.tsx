'use client'
import { useEffect, useState } from "react"
import { Button, Typography, Card, Radio, RadioGroup, Input } from '@douyinfe/semi-ui';
import QuestionMatchLine from './QuestionMatchLine';

export default function PreviewBlock({ questions }: { questions: any }) {
  const { Title, Paragraph } = Typography
  const [questionIdx, setQuestionIdx] = useState<number>(0)

  useEffect(() => {
    setQuestionIdx(0)
  }, [questions])

  const PictureWordRecognition = (content: any) => {
    return <div className="w-full">
      <img src={content?.image_url}  className="my-4 max-w-[100%]"/>
      <RadioGroup type='card'>
        {
          content?.options.map((option: any) => {
            return <Radio key={option.text} value={option.text}>{option.text}</Radio>
          })
        }
      </RadioGroup>
    </div>
  };

  const VocabularyMatching = (content: any) => {
    const dataSource: any[] = []
    content?.left_items?.map((item: any, index: number) => {
      dataSource.push({
        leftOption: item,
        rightOption: content.right_items[index]
      })
    })
    const standardAnswers = {}
    content?.correct_pairs?.map((pair: any) => {
      standardAnswers[pair.left] = pair.right
    })
    return <QuestionMatchLine dataSource={dataSource} standardAnswers={standardAnswers} />
  };

  const FillInTheBlanks = (content: any) => {
    return <div className="mt-20 w-2/3">
      <Input placeholder="请输入答案" />
    </div>
  };

  const ListeningComprehension = (content: any) => {
    return <div>听力选择</div>
  };

  const OralPronunciation = (content: any) => {
    return <div>口语发音</div>
  };

  return <div className="h-full w-4/5 flex flex-col justify-center items-center">
    <Card style={{ height: '80%', width: '100%' }}>
      <Title heading={5}>{questionIdx + 1}. {questions[questionIdx].content.question_text}</Title>
      {
        questions[questionIdx].type === '看图认字' && PictureWordRecognition(questions[questionIdx].content)
      }
      {
        questions[questionIdx].type === '词汇匹配' && VocabularyMatching(questions[questionIdx].content)
      }
      {
        questions[questionIdx].type === '字词填空' && FillInTheBlanks(questions[questionIdx].content)
      }
      {
        questions[questionIdx].type === '听力选择' && ListeningComprehension(questions[questionIdx].content)
      }
      {
        questions[questionIdx].type === '口语发音' && OralPronunciation(questions[questionIdx].content)
      }
    </Card>
    <div className="flex mt-4">
      {questions.length > 1 && questionIdx > 0 && <Button onClick={() => { setQuestionIdx(questionIdx - 1) }}>上一题</Button>}
      <Button type="primary" disabled className="mx-4">重新生成</Button>
      {questions.length > 1 && questionIdx < questions.length - 1 && <Button onClick={() => { setQuestionIdx(questionIdx + 1) }}>下一题</Button>}
    </div>
  </div>
}