'use client'

import { Breadcrumb, Button, Card, Typography, Toast, Spin } from '@douyinfe/semi-ui';
import { IconBadge } from '@douyinfe/semi-icons-lab';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { IconLoading, IconCalendar, IconUserCircle } from '@douyinfe/semi-icons';
import { formatUTCTimeToBeijinTime, isEmpty } from '@/utils/tools'
import { AbilityOrder } from '@/utils/constants';
import { cn } from '@/utils/tailwind';

import PictureWordRecognition from './PictureWordRecognition';
import VocabularyMatching from './VocabularyMatching';
import FillInTheBlanks from './FillInTheBlanks';
import RenderPinyin from "./RenderPinyin";
import ListeningComprehension from './ListeningComprehension';
import OralPronunciation from './OralPronunciation';

const { Title, Text } = Typography

export default function UnitOne({ role = "STUDENT" }: { role: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hid = searchParams.get('hid');
  const [homeworkInfo, setHomeworkInfo] = useState<any>({});
  const [homeworkStatus, setHomeworkStatus] = useState<any>({});
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentAnswer, setStudentAnswer] = useState<any>({});
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchHomework()
  }, [hid]);

  useEffect(() => {
    if (homeworkInfo?.qid_list?.length > 0) {
      fetchQuestions()
    }
  }, [homeworkInfo]);

  const fetchHomework = async () => {
    setLoading(true);
    const res = await fetch(`/api/unit-one/homework?hid=${hid}`, {
      method: 'GET',
      cache: 'no-store',
    });
    const data = await res.json();
    setLoading(false);
    console.log('fetch unit-one/homework------->', data);

    if (data?.error) {
      Toast.error('查询失败，请刷新重试');
    }

    setHomeworkInfo(data?.data[0] || {});
    setStudentAnswer(data?.data[0]?.student_answer || {});
    setHomeworkStatus(data?.data[0]?.status || {});
  }

  const fetchQuestions = async () => {
    const qids = homeworkInfo?.qid_list
    if (qids?.length > 0) {
      setLoading(true);
      const res = await fetch('/api/unit-one/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          qids,
        })
      });

      setLoading(false);
      const data = await res.json();

      console.log('fetchQuestions------->', data);

      if (data?.error) {
        Toast.error('查询题目列表失败，请刷新重试');
      }
      setQuestions(data?.data || []);
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

  const abilityWithOrder = useMemo(() => {
    const curAbilities = Object.keys(questionsGroupByAbility);
    const abilities = AbilityOrder.filter((ability) => curAbilities.includes(ability));
    console.log('abilityWithOrder------->', abilities);
    return abilities;
  }, [questionsGroupByAbility]);


  const handleUpdateStudentAnswer = (qid: string, answer: any) => {
    console.log('handleUpdateStudentAnswer------->', qid, answer);
    setStudentAnswer((prev: any) => {
      return {
        ...prev,
        [qid]: answer
      }
    });
  }

  const handleSubmit = async () => {
    console.log('studentAnswer------->', studentAnswer);
    const qids = homeworkInfo?.qid_list

    const validate = qids.every((qid: string) => {
      const answer = studentAnswer[qid];
      if (isEmpty(answer)) {
        Toast.error('请完成所有题目后再提交');
        return false;
      }
      return true;
    })

    if (!validate) {
      return;
    }

    setSubmitLoading(true);
    const res = await fetch('/api/do-homework', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        hid,
        student_answer: studentAnswer,
        status: 'SUBMITTED',
        submit_time: new Date().toISOString()
      })
    });

    setSubmitLoading(false);
    const data = await res.json();

    console.log('handleSubmit------->', data);

    if (data?.error) {
      Toast.error('提交失败，请重试');
    } else {
      Toast.success('提交成功');
      router.push('/learnplace/homework');
    }
  }

  const StudentAnswerCard = () => {
    return <Card className='w-[300px]'>
      <div className='mb-5 pb-5 border-b border-dotted'>
        <Title heading={4}>答题卡</Title>
        <div className='flex gap-4 mt-2'>
          <div className='flex items-center gap-2'><div className='w-4 h-4 border'></div>未做</div>
          <div className='flex items-center gap-2'><div className='w-4 h-4 bg-[#ff7900]'></div>已做</div>
        </div>
      </div>
      <div>
        {
          abilityWithOrder?.map((ability) => {
            return <div key={ability}>
              {
                questionsGroupByAbility[ability].map((typeGroup: any) => {
                  return <div key={typeGroup.type} className="mt-4">
                    <Title heading={6} >{typeGroup.type}</Title>
                    <div className='flex gap-4 my-2'>
                      {
                        typeGroup.questions.map((question: any, idx: number) => {
                          return <a href={`#${question.qid}`} key={question.qid} className='mt-2'>
                            <div className={cn('w-6 h-6 border text-center', !isEmpty(studentAnswer[question.qid]) && 'bg-[#ff7900] font-bold text-white')}>
                              {idx + 1}
                            </div>
                          </a>
                        })
                      }
                    </div>

                  </div>
                })
              }
            </div>
          })
        }
      </div>
      <div className='mt-10'>
        <Button theme='solid' size='large' loading={submitLoading} type='primary' block onClick={handleSubmit}>提交作业</Button>
      </div>
    </Card>
  }

  const TeachGradCard = () => {
    return <Card className='w-[300px]'>
      <div className='mb-5 pb-5 border-b border-dotted'>
        <Title heading={4}>作业批改</Title>
        <div className='my-2'><Text code>除【口语发音】外的题目都支持AI批改</Text></div>
        <div className='flex gap-4 mt-4'>
          <div className='flex items-center gap-2'><div className='w-4 h-4 border'></div>未批改</div>
          <div className='flex items-center gap-2'><div className='w-4 h-4 bg-[#22c55e]'></div>正确</div>
          <div className='flex items-center gap-2'><div className='w-4 h-4 bg-[#ff0000]'></div>错误</div>
        </div>
      </div>
    </Card>
  }

  const ScoreCard = () => {
    return <Card className='w-[300px]'>
      <div className='mb-5 pb-5 border-b border-dotted'>
        <Title heading={4}>成绩单</Title>
      </div>
    </Card>
  }

  return (
    <div className="max-w-[1168px] min-w-[1000px] mx-auto">
      <Breadcrumb compact={false} className="mb-4">
        <Breadcrumb.Item icon={<IconBadge />}>
          {role === 'STUDENT' ? <Link href="/learnplace/homework">
            我的作业
          </Link> : <Link href="/teachplace/homework">
            作业批改</Link>}
        </Breadcrumb.Item>
        <Breadcrumb.Item>作业详情</Breadcrumb.Item>
      </Breadcrumb>
      {loading && <div className='mt-40 flex justify-center items-center'>
        <Spin spinning={loading} indicator={<IconLoading />} size='large' />
      </div>}

      {!loading && <div className='flex gap-6'>
        <div className='flex-1'>
          <Card>
            <Title className='text-center' heading={3}>{homeworkInfo?.practice?.title}</Title>
            <p className='text-center'>{homeworkInfo?.practice?.description}</p>
            <div className='flex justify-center gap-6'>
              <div className='flex justify-center items-center gap-1'>
                <span className='text-gray-400'>{role === 'STUDENT' ? '教师信息：' : '学生信息'}</span>
                <IconUserCircle />
                <span>{role === 'STUDENT' ? homeworkInfo?.teacher?.scientific_name : homeworkInfo?.student?.scientific_name}({role === 'STUDENT' ? homeworkInfo?.teacher?.email : homeworkInfo?.student?.email})</span>
              </div>
              <div className='flex justify-center items-center gap-1'>
                <span className='text-gray-400'>{role === 'STUDENT' ? '布置时间：' : '提交时间：'}</span>
                <IconCalendar />
                <span>{formatUTCTimeToBeijinTime(role === 'STUDENT' ? homeworkInfo?.created_at : homeworkInfo?.submit_time)}</span>
              </div>
            </div>
            <div className='flex justify-center gap-6 mt-2'>
              <div className='flex justify-center items-center gap-1'>
                <span className='text-gray-400'>题目数量：</span>
                <span>{questions?.length}</span>
              </div>
              <div className='flex justify-center items-center gap-1'>
                <span className='text-gray-400'>总分：</span>
                <span>100</span>
              </div>
            </div>
          </Card>
          {
            abilityWithOrder?.map((ability) => {
              return <div key={ability}>
                {
                  questionsGroupByAbility[ability].map((typeGroup: any) => {
                    return <Card key={typeGroup.type} className='mt-4' title={typeGroup.type}>
                      {
                        typeGroup.questions.map((question: any, idx: number) => {
                          return <div key={question.qid} className='mt-2' id={question.qid}>
                            <Title heading={6}>{idx + 1}. <RenderPinyin text={question?.content?.question_text?.text} pinyin={question?.content?.question_text?.pinyin || question?.content?.question_text?.pingyin}></RenderPinyin>。</Title>
                            {
                              question?.question_type === '看图认字' && <PictureWordRecognition qid={question.qid} homeworkStatus={homeworkStatus} content={question?.content} showAnswer={false} studentAnswer={studentAnswer} handleUpdateStudentAnswer={handleUpdateStudentAnswer} />
                            }
                            {
                              question?.question_type.includes('词汇匹配') && <VocabularyMatching qid={question.qid} homeworkStatus={homeworkStatus} content={question?.content} showAnswer={false} studentAnswer={studentAnswer} handleUpdateStudentAnswer={handleUpdateStudentAnswer} />
                            }
                            {
                              question?.question_type === '字词填空' && <FillInTheBlanks qid={question.qid} homeworkStatus={homeworkStatus} content={question?.content} showAnswer={false} studentAnswer={studentAnswer} handleUpdateStudentAnswer={handleUpdateStudentAnswer} />
                            }
                            {
                              question?.question_type === '听力选择' && <ListeningComprehension qid={question.qid} homeworkStatus={homeworkStatus} content={question?.content} showAnswer={false} studentAnswer={studentAnswer} handleUpdateStudentAnswer={handleUpdateStudentAnswer} />
                            }
                            {
                              question?.question_type === '口语发音' && <OralPronunciation qid={question.qid} homeworkStatus={homeworkStatus} content={question?.content} showAnswer={false} studentAnswer={studentAnswer} handleUpdateStudentAnswer={handleUpdateStudentAnswer} />
                            }
                          </div>
                        })
                      }
                    </Card>
                  })
                }
              </div>
            })
          }
        </div>
        {role === 'STUDENT' && homeworkStatus === 'ASSIGNED' && <StudentAnswerCard />}
        {role === 'TEACHER' && homeworkStatus === 'SUBMITTED' && <TeachGradCard />}
        {homeworkStatus === 'GRADED' && <ScoreCard />}
      </div>}
    </div>
  );
}