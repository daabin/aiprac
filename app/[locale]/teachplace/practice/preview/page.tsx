'use client'

import { Breadcrumb, Card, Carousel } from '@douyinfe/semi-ui';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from "next/navigation";
import { issuesQuestions } from './mock';
import { cn } from '@/utils/tailwind';
import PreviewBlock from './components/PreviewBlock';

export default function PracticePreviewPage() {
  const searchParams = useSearchParams();
  const pid = searchParams.get('pid');
  const [curIssueQuestion, setCurIssueQuestion] = useState<any>({});

  // 将 issuesQuestions 按 question_ability 字段分组 
  const issuesGroupByAbility = useMemo(() => {
    return issuesQuestions.reduce((acc, cur) => {
      if (!acc[cur.question_ability]) {
        acc[cur.question_ability] = [];
      }
      acc[cur.question_ability].push(cur);
      return acc;
    }, {})
  }, [issuesQuestions]);

  const handleClickIssue = (issue: any) => {
    if (issue.gen_status === 0) {
      return;
    }
    setCurIssueQuestion(issue);
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
            issuesGroupByAbility && Object.keys(issuesGroupByAbility).map((ability) => {
              return (
                <div key={ability} className='px-2'>
                  <div className='text-lg font-bold mb-4'>{ability}</div>
                  {
                    issuesGroupByAbility[ability].map((issue: any) => {
                      return (
                        <div key={issue.id} className={cn('flex items-center pl-4 mb-4', curIssueQuestion.id === issue.id ? 'text-[#ff7900] font-bold' : '', issue.gen_status === 1 ? 'hover:cursor-pointer hover:font-bold' : 'opacity-75 hover:cursor-not-allowed')} onClick={() => handleClickIssue(issue)}>
                          <div>{issue.question_type}</div>
                          {
                            issue.gen_status === 1 && <div>（{issue.questions?.length}）</div>
                          }
                          {
                            issue.gen_status !== 1 && <div className='text-red-200'>（生成失败）</div>
                          }
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
          {!curIssueQuestion?.questions && <div>请点击左侧题目类型查看</div>}
          {curIssueQuestion?.questions?.length > 0 && <PreviewBlock questions={curIssueQuestion?.questions} />}
        </div>
      </Card>
    </section>
  );
}