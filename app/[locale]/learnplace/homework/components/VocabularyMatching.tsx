import QuestionMatchLine from "./QuestionMatchLine"
import { shuffleArray } from "@/utils/tools"

export default function VocabularyMatching({ content, showAnswer }: { content: any, showAnswer: boolean  }) {
  const dataSource: any[] = []
  const rights = shuffleArray([...content?.right_items])
  content?.left_items?.text?.map((item: any, index: number) => {
    dataSource.push({
      leftOption: `${item}(${content?.left_items?.pingyin[index]})`,
      rightOption: rights[index]
    })
  })
  const standardAnswers = {}
  content?.correct_pairs?.map((pair: any) => {
    standardAnswers[pair.left] = pair.right
  })
  return <QuestionMatchLine showAnswer={showAnswer} qid={content.qid} dataSource={dataSource} standardAnswers={standardAnswers} />
}