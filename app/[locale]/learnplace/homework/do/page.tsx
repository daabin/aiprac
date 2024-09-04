'use client'

import { Breadcrumb, Button, Card, Progress, Typography, Toast, Spin } from '@douyinfe/semi-ui';
import { IconBadge } from '@douyinfe/semi-icons-lab';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { IconLoading, IconCalendar, IconUserCircle } from '@douyinfe/semi-icons';
import { formatUTCTimeToBeijinTime } from '@/utils/tools'
import { AbilityOrder } from '@/utils/constants';
import PictureWordRecognition from '../components/PictureWordRecognition';
import VocabularyMatching from '../components/VocabularyMatching';
import FillInTheBlanks from '../components/FillInTheBlanks';
import RenderPinyin from "../components/RenderPinyin";
import ListeningComprehension from '../components/ListeningComprehension';
import OralPronunciation from '../components/OralPronunciation';

const { Title } = Typography

export default function DoHomeworkPage() {
  const searchParams = useSearchParams();
  const hid = searchParams.get('hid');
  const [questions, setQuestions] = useState<any[]>([]);
  const [practiceInfo, setPracticeInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取题目列表
    fetchQuestions();
    fetchPracticeInfo()
  }, [hid]);

  const fetchQuestions = async () => {
    const qids = await fetchQids()
    console.log('qids------->', qids);

    if (qids?.length > 0) {

      const res = await fetch('/api/do-homework', {
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

    } else {
      setLoading(false);
      Toast.warning('当前作业没有题目');
    }
  }

  const fetchQids = async () => {
    const res = await fetch(`/api/do-homework?hid=${hid}`, {
      method: 'GET',
      cache: 'no-store',
    });
    const data = await res.json();

    console.log('fetchQids------->', data);
    let qids = []
    if (data?.error) {
      Toast.error('查询失败，请刷新重试');
    } else {
      qids = data?.data[0]?.qid_list || []
    }

    return qids
  }

  const fetchPracticeInfo = async () => {
    const res = await fetch(`/api/do-homework/practice-info?hid=${hid}`, {
      method: 'GET',
      cache: 'no-store',
    });
    const data = await res.json();

    console.log('fetchPracticeInfo------->', data?.data[0]);

    if (data?.error) {
      Toast.error('查询练习信息失败，请刷新重试');
    } else {
      setPracticeInfo(data?.data[0] || {})
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


  return (
    <div className="max-w-[1168px] min-w-[1000px] mx-auto">
      <Breadcrumb compact={false} className="mb-4">
        <Breadcrumb.Item icon={<IconBadge />}>
          <Link href="/learnplace/homework">
            我的作业
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>作业详情</Breadcrumb.Item>
      </Breadcrumb>
      {loading && <div className='mt-40 flex justify-center items-center'>
        <Spin spinning={loading} indicator={<IconLoading />} size='large' />
      </div>}

      {!loading && <div className='flex gap-6'>
        <div className='flex-1'>
          <Card>
            <Title className='text-center' heading={3}>{practiceInfo?.practice?.title}</Title>
            <p className='text-center'>{practiceInfo?.practice?.description}</p>
            <div className='flex justify-center gap-6'>
              <div className='flex justify-center items-center gap-1'>
                <span className='text-gray-400'>教师信息：</span>
                <IconUserCircle />
                <span>{practiceInfo?.practice?.users?.scientific_name}({practiceInfo?.practice?.users?.email})</span>
              </div>
              <div className='flex justify-center items-center gap-1'>
                <span className='text-gray-400'>布置时间：</span>
                <IconCalendar />
                <span>{formatUTCTimeToBeijinTime(practiceInfo?.created_at)?.split(' ')[0]}</span>
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
                              question?.question_type === '看图认字' && <PictureWordRecognition content={question?.content} showAnswer={false} />
                            }
                            {
                              question?.question_type.includes('词汇匹配') && <VocabularyMatching content={question?.content} showAnswer={false} />
                            }
                            {
                              question?.question_type === '字词填空' && <FillInTheBlanks content={question?.content} showAnswer={false} />
                            }
                            {
                              question?.question_type === '听力选择' && <ListeningComprehension content={question?.content} showAnswer={false} />
                            }
                            {
                              question?.question_type === '口语发音' && <OralPronunciation content={question?.content} showAnswer={false} />
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
        <Card className='w-[300px]'>
          <div className='flex items-center gap-4'>
            <Title heading={6}>进度</Title>
            <Progress percent={80} style={{ height: '8px', width: '120px' }} />
            <p>{1}/{questions?.length}</p>
          </div>
          <div className='mt-5 py-5 border-t border-dotted'>
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
                                <div className='w-6 h-6 border text-center'>
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
            <Button theme='solid' size='large' type='primary' block>提交作业</Button>
          </div>
        </Card>
      </div>}
    </div>
  );
}