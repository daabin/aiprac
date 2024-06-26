'use client'

import { Breadcrumb, Card, Toast } from '@douyinfe/semi-ui';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from "next/navigation";
import { cn } from '@/utils/tailwind';
import PreviewBlock from './components/PreviewBlock';

export default function PracticePreviewPage() {
  const searchParams = useSearchParams();
  const pid = searchParams.get('pid');
  const [curQuestionQuestion, setCurQuestionQuestion] = useState<any>([]);
  const [curType, setCurType] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    // 获取题目列表
    fetchQuestions();
  }, [pid]);

  const fetchQuestions = async () => {
    const res = await fetch(`/api/questions?pid=${pid}`, {
      method: 'GET',
      cache: 'no-store',
    });
    const data = await res.json();

    console.log('fetchQuestions------->', data);

    if (data?.error) {
      Toast.error('查询失败，请刷新重试');
    } else {
      setQuestions(data.data)
    }
  }

  // 将 questionsQuestions 按 question_ability 字段分组 
  // 再将分组后的 value 按 question_type 字段分组
  const questionsGroupByAbility = useMemo(() => {
    const result: any = {};
    questions.forEach((question) => {
      if (!result[question.question_ability]) {
        result[question.question_ability] = [];
      }
      result[question.question_ability].push(question);
    });

    Object.keys(result).forEach((ability) => {
      const questions = result[ability];
      const groupByType: any = {};
      questions.forEach((question: any) => {
        if (!groupByType[question.question_type]) {
          groupByType[question.question_type] = [];
        }
        groupByType[question.question_type].push(question);
      });
      result[ability] = Object.keys(groupByType).map((type) => {
        return {
          type,
          questions: groupByType[type]
        }
      });
    });

    console.log('questionsGroupByAbility------->', result);
    return result;
  }, [questions]);

  const handleClickQuestion = (question: any, type: string) => {
    console.log('handleClickQuestion------->', question);
    setCurQuestionQuestion(question);
    setCurType(type);
  }

  return (
    <section className='h-full flex flex-col'>
      <div className='mb-4'>
        <Breadcrumb compact={false} className="mb-4">
          <Breadcrumb.Item><Link href={'/teachplace/practice'}> 练习</Link></Breadcrumb.Item>
          <Breadcrumb.Item>题目预览</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Card className='flex-1 flex' bodyStyle={{ height: '100%', width: '100%', display: 'flex' }}>
        <div className='w-[300px] h-full border p-4'>
          {
            questionsGroupByAbility && Object.keys(questionsGroupByAbility).map((ability) => {
              return (
                <div key={ability} className='px-2'>
                  <div className='text-lg font-bold mb-4'>{ability}</div>
                  {
                    questionsGroupByAbility[ability].map((typeGroup: any) => {
                      return (
                        <div key={typeGroup.type}
                          className={cn('flex items-center pl-4 mb-4 hover:cursor-pointer', curType === typeGroup.type ? 'text-[#ff7900] font-bold' : '')}
                          onClick={() => handleClickQuestion(typeGroup.questions, typeGroup.type)}>
                          <div>{typeGroup.type}</div>
                          <div>（{typeGroup.questions?.length}）</div>
                        </div>
                      )
                    })
                  }
                </div>
              )
            })
          }
        </div>
        <div className='flex-1 h-full border border-l-0 bg-slate-50 flex justify-center items-center'>
          {curQuestionQuestion.length === 0 ? <div>请点击左侧题目类型查看</div> : <PreviewBlock questions={curQuestionQuestion} />}
        </div>
      </Card>
    </section>
  );
}