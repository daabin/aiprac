'use client'

import { IconSend } from '@douyinfe/semi-icons';
import { Button, Modal, CheckboxGroup, Checkbox, Typography, Spin, Avatar, Toast } from '@douyinfe/semi-ui';
import { IconLoading } from '@douyinfe/semi-icons';
import { useState } from 'react';
import { formatUTCTimeToBeijinTime } from '@/utils/tools';

const { Title } = Typography;

export default function AssignHomework({ pid }: { pid: string }) {
  const [showModal, setShowModal] = useState(false);
  const [classStudents, setClassStudents] = useState<any[]>([]);
  const [initailLoading, setInitailLoading] = useState(true);
  const [selectedClasses, setSelectedClasses] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  const getClassList = async () => {
    setInitailLoading(true);
    const res = await fetch('/api/teacher-class-students', {
      method: 'GET',
      cache: 'no-store'
    });
    const data = await res.json();

    if (data?.error) {
      Toast.error('查询班级列表，请刷新重试');
    } else {
      console.log('data------->', data.data);
      // 数据处理
      const result: any[] = []

      if (data?.data?.length > 0) {
        data?.data?.forEach((dItem: any) => {
          if (result?.findIndex((rItem) => rItem.class_id === dItem.class_id) === -1) {
            result.push({
              class_id: dItem.class_id,
              class_name: dItem.class_name,
              class_remark: dItem.class_remark,
              created_at: dItem.created_at,
              students: distinctStudent(dItem.student_class)
            })
          }
        })

        console.log('result------->', result);
        setClassStudents(result);
      }
    }
  }

  const distinctStudent = (students: any[]) => {
    const result: any[] = [];
    if (students?.length > 0) {
      students?.forEach((sItem: any) => {
        if (result?.findIndex((rItem) => rItem.user_id === sItem.student_id) === -1) {
          result.push({ ...sItem?.users, join_time: sItem.created_at });
        }
      })
    }
    return result
  }

  const handleAssign = async () => {
    setShowModal(true);
    await getClassList();
    setInitailLoading(false);
  }

  const handleSelectClass = (selected: any[]) => {
    console.log('selected------->', selected);
    setSelectedClasses(selected);
    const students: any[] = [];
    selected.forEach((item) => {
      const classItem = classStudents.find((cItem) => cItem.class_id === item);
      if (classItem?.students?.length > 0) {
        classItem.students.forEach((sItem: any) => {
          // students 不包含当前学生则添加
          if (students.findIndex((s) => s.user_id === sItem.user_id) === -1) {
            students.push(sItem);
          }
        })
      }
    })
    setSelectedStudents(students);
  }

  const handleRemoveStudent = (userId: string) => {
    const newStudents = selectedStudents.filter((item) => item.user_id !== userId);
    setSelectedStudents(newStudents);
  }

  const doAssign = async () => {
    if (selectedStudents?.length === 0) {
      Toast.warning('请选择待布置作业的班级及学生');
      return;
    }
    if (selectedStudents?.length > 0 && pid) {
      setSubmitLoading(true);
      // 获取 pid 下所有出题成功的题目
      const questions = await getPidQuestions();
      let qids: string[]
      console.log('questions------->', questions);

      if (!questions) {
        return;
      } else {
        qids = questions.map((item: any) => item.qid);
        console.log('qids------->', qids);
      }

      setSubmitLoading(false);

      const res = await fetch('/api/assign-homework', {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pid,
          questions: qids,
          students: selectedStudents
        })
      });
      const data = await res.json();

      if (data?.error) {
        Toast.error('布置作业失败，请重试');
      } else {
        Toast.success('布置作业成功');
        setShowModal(false);
        setClassStudents([]);
        setSelectedClasses([]);
        setSelectedStudents([]);
      }
    }
  }

  const getPidQuestions = async () => {
    const res = await fetch(`/api/success-questions?pid=${pid}`, {
      method: 'GET',
      cache: 'no-store'
    });
    const data = await res.json();

    let result: any;
    if (data?.error) {
      result = null;
      Toast.error('获取题目失败，请刷新重试');
    } else if (data?.data && data?.data?.length === 0) {
      result = null;
      Toast.warning('当前练习下没有出题成功的题目，请先出题');
    } else {
      result = data?.data?.length > 0 ? data?.data : null;
    }

    return result;
  }

  return (
    <div>
      <Button size='small' type="primary" icon={<IconSend />} onClick={() => handleAssign()}>布置作业</Button>
      <Modal
        title="布置作业"
        closable={false}
        visible={showModal}
        width={800}
        onCancel={() => {
          setShowModal(false);
          setClassStudents([]);
          setSelectedClasses([]);
          setSelectedStudents([]);
        }}
        confirmLoading={submitLoading}
        onOk={() => doAssign()}
      >
        <Spin spinning={initailLoading} indicator={<IconLoading />} tip="数据加载中...">
          {!initailLoading ? <div className='flex flex-row'>
            <CheckboxGroup onChange={handleSelectClass} value={selectedClasses} className='w-1/3'>
              <Title heading={5}>班级列表</Title>
              {
                classStudents.map((item) => {
                  return (
                    <div key={item.class_id}>
                      <Checkbox value={item.class_id}>{item.class_name}</Checkbox>
                    </div>
                  )
                })
              }
            </CheckboxGroup>
            <div className='w-1/12 border-l-2'></div>
            <div className='w-7/12'>
              <Title heading={5}>当前选择将通知 {selectedStudents?.length} 位学生</Title>
              {
                selectedStudents.map((item) => {
                  return (
                    <div key={item.user_id} className="my-4 flex items-center justify-between">
                      <div className='flex'>
                        <Avatar color="red">{item.user_name}</Avatar>
                        <div className='px-4 py-1'>
                          <p className='font-bold'>{item.scientific_name}</p>
                          <p>加入课程时间：{formatUTCTimeToBeijinTime(item?.join_time).split(' ')[0]}</p>
                        </div>
                      </div>
                      <Button size='small' theme='light' onClick={() => handleRemoveStudent(item.user_id)}>移除通知</Button>
                    </div>
                  )
                })
              }
            </div>
          </div> : <div className='w-20 h-20'></div>
          }
        </Spin>
      </Modal>
    </div>
  )
}