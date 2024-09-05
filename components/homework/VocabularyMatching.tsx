import { useMemo } from "react"
import QuestionMatchLine from "./QuestionMatchLine"
import { shuffleArray } from "@/utils/tools"

export default function VocabularyMatching({ qid, content, showAnswer, studentAnswer, handleUpdateStudentAnswer, homeworkStatus }: { qid: any, content: any, showAnswer: boolean, studentAnswer: any, handleUpdateStudentAnswer: any, homeworkStatus: any }) {
  const dataSource = useMemo(() => {
    const res: any[] = []
    const rights = shuffleArray([...content?.right_items])
    content?.left_items?.text?.map((item: any, index: number) => {
      res.push({
        leftOption: `${item}(${content?.left_items?.pingyin[index]})`,
        rightOption: rights[index]
      })
    })

    return res
  }, [content, qid])

  const standardAnswers = useMemo(() => {
    const res = {}
    content?.correct_pairs?.map((pair: any) => {
      res[pair.left] = pair.right
    })
    return res
  }, [content, qid])

  return <QuestionMatchLine showAnswer={showAnswer} qid={qid} dataSource={dataSource} standardAnswers={standardAnswers} studentAnswer={studentAnswer} handleUpdateStudentAnswer={handleUpdateStudentAnswer} homeworkStatus={homeworkStatus}/>
}