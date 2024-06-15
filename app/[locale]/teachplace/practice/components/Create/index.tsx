
'use client'
import { useMemo, useState } from "react"
import { Typography, Button, Notification } from '@douyinfe/semi-ui';
import { Spin } from '@douyinfe/semi-ui';
import { IconLoading } from '@douyinfe/semi-icons';
import questionTypeData from '@/utils/questionTypeData';
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import StepFive from "./StepFive";

export default function Create() {
  const { Title } = Typography;

  const [steps, setSteps] = useState<number>(1)
  const [knowledgePoints, setKnowledgePoints] = useState<any[]>([])
  const [capabilityTerms, setCapabilityTerms] = useState<any[]>([])
  const [difficulty, setDifficulty] = useState<any>({})
  const [questionTypes, setQuestionTypes] = useState<any[]>([])
  const [questionCount, setQuestionCount] = useState<any[]>([])


  const total = useMemo(() => {
    return questionCount.reduce((acc, cur) => acc + cur.count, 0);
  }, [questionCount])

  const Header = () => {
    const titles = ['1、请输入本节课知识点', '2、请选择考察能力项', '3、请选择题目难度水平', '4、请选择题型', '5、请选择题量', '6、生成题目']

    return (
      <div className="py-4">
        <Title heading={3}>{titles[steps - 1]}</Title>
      </div>
    )
  }

  const Content = () => {
    return (
      <div className="flex-1">
        {steps === 1 && <StepOne knowledgePoints={knowledgePoints} setKnowledgePoints={setKnowledgePoints} />}
        {steps === 2 && <StepTwo capabilityTerms={capabilityTerms} setCapabilityTerms={setCapabilityTerms} />}
        {steps === 3 && <StepThree difficulty={difficulty} setDifficulty={setDifficulty} />}
        {steps === 4 && <StepFour questionTypes={questionTypes} setQuestionTypes={setQuestionTypes} />}
        {steps === 5 && <StepFive questionCount={questionCount} setQuestionCount={setQuestionCount} total={total}/>}
        {steps === 6 && <StepSix />}
      </div>
    )
  }

  const handleGen = () => {
    console.log('handleGen')
  }

  const back = () => {
    if (steps > 1) {
      setSteps(steps - 1)
    }
  }

  const StepSix = () => {
    return (
      <div className="h-full flex flex-col justify-center items-center">
          <Spin indicator={<IconLoading size="extra-large"/>} />
          <Title heading={5} style={{margin: "20px 0", color: 'rgb(127 29 29)'}}>正在为你生成第 {6} / {total} 个题目......</Title>
          <Button type="warning" onClick={back}>取消生成</Button>
      </div>
    )
  }

  const Footer = () => {
    const forward = () => {
      switch (steps) {
        case 1:
          if (knowledgePoints.length === 0) {
            Notification.warning({ title: '请至少输入一个知识点', theme: 'light', position: 'bottom' })
            return
          }
          break
        case 2:
          if (capabilityTerms.length === 0) {
            Notification.warning({ title: '请至少选择一个能力项', theme: 'light', position: 'bottom' })
            return
          }
          break
        case 3:
          if (Object.keys(difficulty).length === 0) {
            Notification.warning({ title: '请选择难度水平', theme: 'light', position: 'bottom' })
            return
          } else {
            const capabilityTermsLabels = capabilityTerms.map((item) => item.label)
            const newQuestionTypes = questionTypeData.filter((item) => {
              return capabilityTermsLabels.includes(item.ability) && item.level === difficulty.value
            })

            setQuestionTypes(newQuestionTypes)
          }
          break
        case 4:
          if (questionTypes.length === 0) {
            Notification.warning({ title: '请至少选择一个题型', theme: 'light', position: 'bottom' })
            return
          } else {
            // 拷贝 questionTypes 至 questionCount 中并增加 count 字段, 初始值为 1
            const newQuestionCount = questionTypes.map((item) => {
              return {
                ...item,
                count: 1
              }
            })

            console.log('newQuestionCount', newQuestionCount)
            setQuestionCount(newQuestionCount)
          }
          break
        case 5:
          const account = questionCount.reduce((acc, cur) => acc + cur.count, 0)
          if (account > 30) {
            Notification.warning({ title: '整套习题数量必须少于30题', theme: 'light', position: 'bottom' })
            return
          }
          break
        case 6:
          handleGen()
          break
        default:
          break
      }

      if (steps < 6) {
        setSteps(steps + 1)
      }
    }

    return (
      <div className="flex justify-end py-4">
        {steps > 1 && steps < 6 && <Button size="large" theme="light" className="mr-2" onClick={back}>上一步</Button>}
        {steps < 6 && <Button size="large" theme="solid" onClick={forward}>下一步</Button>}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      <Header />
      <Content />
      <Footer />
    </div>
  )
}
