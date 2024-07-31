'use client'
import { useEffect, useMemo, useRef, useState } from "react"
import { Button, Typography, Card, Radio, RadioGroup, Input } from '@douyinfe/semi-ui';
import PictureWordRecognition from './PictureWordRecognition';
import VocabularyMatching from './VocabularyMatching';
import FillInTheBlanks from './FillInTheBlanks';
import RenderPinyin from "./RenderPinyin";
import ListeningComprehension from './ListeningComprehension';
import OralPronunciation from './OralPronunciation';

export default function PreviewBlock({ questions }: { questions: any }) {
  const { Title } = Typography
  const [questionIdx, setQuestionIdx] = useState<number>(0)

  useEffect(() => {
    setQuestionIdx(0)
  }, [questions])

  const curQuestion = useMemo(() => {
    return questions[questionIdx]
  }, [questionIdx, questions])

  return <div className="w-4/5 flex flex-col justify-center items-center">
    {curQuestion && <Card style={{ height: '80%', width: '100%' }}>
      <Title heading={5}>{questionIdx + 1}. <RenderPinyin text={curQuestion?.content?.question_text?.text} pinyin={curQuestion?.content?.question_text?.pinyin || curQuestion?.content?.question_text?.pingyin}></RenderPinyin>。</Title>
      {
        curQuestion?.question_type === '看图认字' && <PictureWordRecognition content={curQuestion?.content} />
      }
      {
        curQuestion?.question_type.includes('词汇匹配') && <VocabularyMatching content={curQuestion?.content} />
      }
      {
        curQuestion?.question_type === '字词填空' && <FillInTheBlanks content={curQuestion?.content} />
      }
      {
        curQuestion?.question_type === '听力选择' && <ListeningComprehension content={curQuestion?.content} />
      }
      {
        curQuestion?.question_type === '口语发音' && <OralPronunciation content={curQuestion?.content} />
      }
    </Card>}
    <div className="flex mt-4">
      {questions.length > 1 && questionIdx > 0 && <Button onClick={() => { setQuestionIdx(questionIdx - 1) }}>上一题</Button>}
      {questions.length > 1 && questionIdx < questions.length - 1 && <Button className="ml-2" onClick={() => { setQuestionIdx(questionIdx + 1) }}>下一题</Button>}
    </div>
  </div>
}