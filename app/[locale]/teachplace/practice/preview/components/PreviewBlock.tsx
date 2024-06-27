'use client'
import { useEffect, useState } from "react"
import { Button, Typography, Card, Radio, RadioGroup, Input } from '@douyinfe/semi-ui';
import PictureWordRecognition from './PictureWordRecognition';
import VocabularyMatching from './VocabularyMatching';
import FillInTheBlanks from './FillInTheBlanks';

export default function PreviewBlock({ questions }: { questions: any }) {
  const { Title, Paragraph } = Typography
  const [questionIdx, setQuestionIdx] = useState<number>(0)

  useEffect(() => {
    console.log('questions------->', questions)
    setQuestionIdx(0)
  }, [questions])

  const ListeningComprehension = (content: any) => {
    return <div>听力选择</div>
  };

  const OralPronunciation = (content: any) => {
    return <div>口语发音</div>
  };

  return <div className="h-full w-4/5 flex flex-col justify-center items-center">
    <Card style={{ height: '80%', width: '100%' }}>
      <Paragraph style={{marginLeft: 16}}>{questions[questionIdx].content?.question_text?.pinyin || questions[questionIdx].content?.question_text?.pingyin}</Paragraph>
      <Title heading={5}>{questionIdx + 1}. {questions[questionIdx].content?.question_text?.text}</Title>
      {
        questions[questionIdx].question_type === '看图认字' && <PictureWordRecognition content={questions[questionIdx].content}/>
      }
      {
        questions[questionIdx].question_type === '词汇匹配' && <VocabularyMatching content={questions[questionIdx].content}/>
      }
      {
        questions[questionIdx].question_type === '字词填空' && <FillInTheBlanks content={questions[questionIdx].content}/>
      }
      {
        questions[questionIdx].question_type === '听力选择' && ListeningComprehension(questions[questionIdx].content)
      }
      {
        questions[questionIdx].question_type === '口语发音' && OralPronunciation(questions[questionIdx].content)
      }
    </Card>
    <div className="flex mt-4">
      {questions.length > 1 && questionIdx > 0 && <Button onClick={() => { setQuestionIdx(questionIdx - 1) }}>上一题</Button>}
      <Button type="primary" disabled className="mx-4">重新生成</Button>
      {questions.length > 1 && questionIdx < questions.length - 1 && <Button onClick={() => { setQuestionIdx(questionIdx + 1) }}>下一题</Button>}
    </div>
  </div>
}