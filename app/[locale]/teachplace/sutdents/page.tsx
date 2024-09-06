'use client'

import { Skeleton, Typography, Button, Breadcrumb, Popconfirm, Table, Dropdown, Modal, Form, Input, Empty, Toast } from '@douyinfe/semi-ui';
import { IllustrationNoContent } from '@douyinfe/semi-illustrations';
import { IconPlus } from '@douyinfe/semi-icons';
import { useState, useEffect, useRef } from 'react';
import { GraduationCap, Ellipsis, BookUser, UserPlus, Settings } from 'lucide-react';
import { MAX_CLASS_ACCOUNT } from '@/utils/constants';
import { nanoid } from 'nanoid'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useParams } from 'next/navigation'
import { isClassInviteCodeExpired } from '@/utils/tools'

const { Column } = Table;

export default function SutdentsPage() {
  const origin = window.location.origin;
  const params = useParams<any>()
  const editClassFromRef = useRef<any>(null);
  const { Title, Paragraph, Text } = Typography;
  const [visibleClass, setVisibleClass] = useState(false);
  const [visibleInvite, setVisibleInvite] = useState(false);
  const [curClass, setCurClass] = useState<any>({});
  const [curClassId, setCurClassId] = useState<string>('');
  const [classList, setClassList] = useState<any[]>([]);
  const [editLoading, setEditLoading] = useState<boolean>(false)
  const [initialLoading, setInitialLoading] = useState<boolean>(true)
  const [curInviteClass, setCurInviteClass] = useState<any>({})
  const [isInviteCodeExpired, setIsInviteCodeExpired] = useState<boolean>(false)
  const [showStudents, setShowStudents] = useState<boolean>(false)
  const [studentList, setStudentList] = useState<any[]>([])
  const [loadingStudent, setLoadingStudent] = useState<boolean>(false)

  useEffect(() => {
    console.log('useEffect props', params);
    getClassList()
  }, [])

  const getClassList = async () => {
    setInitialLoading(true);
    const res = await fetch('/api/classes', {
      method: 'GET',
      cache: 'no-store'
    });
    const data = await res.json();
    setInitialLoading(false);

    if (data?.error) {
      Toast.error('查询失败，请刷新重试');
    } else {
      setClassList(data.data)
    }
  }

  const handleViewStudentsList = async (class_id: string) => {
    setCurClassId(class_id)
    setLoadingStudent(true)
    setShowStudents(true)
    const res = await fetch(`/api/class-student?class_id=${class_id}`, {
      method: 'GET',
      cache: 'no-store'
    });
    const data = await res.json();

    setLoadingStudent(false);
    if (data?.error) {
      Toast.error('查询学生信息失败，请稍后重试');
    }

    if (data?.data) {
      console.log('查询学生信息成功', data.data);
      const result: any[] = []
      const students: string[] = []
      data.data.forEach((item: any) => {
        if (!students.includes(item.student_id)) {
          students.push(item.student_id)
          result.push(item.users)
        }
      })

      setStudentList(result)
    }
  }

  const handleCancelViewStudents = () => {
    setShowStudents(false)
    setStudentList([])
    setCurClassId('')
  }

  const handleRemoveStudent = async (student_id: string) => {
    console.log('移除学生', student_id, curClassId);
    const req = {
      class_id: curClassId,
      student_id: student_id
    }
    const res = await fetch('/api/class-student', {
      method: 'DELETE',
      body: JSON.stringify(req),
    });

    const data = await res.json();

    if (data?.error) {
      Toast.error('移除学生失败，请稍后重试');
    } else {
      Toast.success('移除学生成功');
      handleViewStudentsList(curClassId)
    }
  }

  const handleInviteStudent = async (class_id: any) => {
    let toastId = Toast.info({ 'content': '加载中...', duration: 0 });
    const res = await fetch(`/api/invite-code?class_id=${class_id}`, {
      method: 'GET',
      cache: 'no-store'
    });
    const data = await res.json();

    Toast.close(toastId);

    if (data?.error) {
      Toast.error('查询邀请码，请稍后重试');
      console.log('查询邀请码失败', data.error);
    }

    console.log('查询邀请码成功', data?.data);
    if (data?.data?.length > 0) {
      setCurInviteClass({
        code: data.data[0].code,
        class_name: data.data[0].classes.class_name,
        class_id: class_id
      })
    }
    setVisibleInvite(true);

    // 判断邀请码是否过期
    setIsInviteCodeExpired(isClassInviteCodeExpired(data.data[0].updated_at || data.data[0].created_at))
  }

  const handleCreate = () => {
    if (classList?.length < MAX_CLASS_ACCOUNT) {
      setVisibleClass(true);
    } else {
      Toast.warning('最多只能创建三个班级');
    }
  }

  const handleSetting = (classInfo: any) => {
    console.log('设置', classInfo);
    setCurClass(classInfo);
    setVisibleClass(true);
    console.log('设置', classInfo);
  }

  const handleSubmitClass = async () => {
    editClassFromRef.current.formApi.validate()
      .then((values: any) => {
        console.log(values);
        doEditReq(values)
      })
      .catch((errors: any) => {
        console.log(errors);
      })
  }

  const doEditReq = async (classInfo: any) => {
    let res: any
    const req: any = {
      class_name: classInfo.class_name,
      class_remark: classInfo.class_remark
    }
    setEditLoading(true)
    if (curClass && curClass?.class_id) {
      // 更新
      req.class_id = curClass.class_id
      res = await fetch('/api/classes', {
        method: 'PUT',
        body: JSON.stringify(req),
      });
    } else {
      res = await fetch('/api/classes', {
        method: 'POST',
        body: JSON.stringify(req),
      });
    }

    const data = await res.json();
    if (data?.error) {
      Toast.error('执行失败，请稍后重试');
    } else {
      setVisibleClass(false);
      setCurClass({});
      // 刷新
      getClassList()

      //  新建班级成功后生成邀请码
      if (!curClass?.class_id) {
        genInviteCode(data?.data[0].class_id)
      }
      setEditLoading(false)
    }
  }

  const genInviteCode = async (class_id: any) => {
    // 生成邀请码
    const req: any = {
      class_id: class_id,
      code: nanoid()
    }
    const res = await fetch('/api/invite-code', {
      method: 'POST',
      body: JSON.stringify(req),
    });
    const data = await res.json();
    console.log('生成邀请码', data);

    handleInviteStudent(class_id)
  }

  const updateInviteCode = async (class_id: any) => {
    // 更新邀请码
    const req: any = {
      class_id: class_id,
      code: nanoid()
    }
    const res = await fetch('/api/invite-code', {
      method: 'PUT',
      body: JSON.stringify(req),
    });
    const data = await res.json();
    console.log('更新邀请码', data);

    handleInviteStudent(class_id)
  }

  const placeholder = (
    <div>
      <Skeleton.Title style={{ height: 100, marginTop: 10 }} />
      <Skeleton.Title style={{ height: 100, marginTop: 10 }} />
      <Skeleton.Title style={{ height: 100, marginTop: 10 }} />
    </div>
  );

  return (
    <section className='h-full'>
      <div className='flex justify-between items-center mb-4'>
        <Breadcrumb compact={false}>
          <Breadcrumb.Item><Title heading={4}>我管理的班级</Title></Breadcrumb.Item>
        </Breadcrumb>
        <Button className='mb-[1rem]' theme='solid' size='default' icon={<IconPlus />} onClick={handleCreate}>新建班级</Button>
      </div>
      <div
        style={{
          backgroundColor: 'var(--semi-color-fill-0)',
          padding: 20
        }}
      >
        <Skeleton active={true} placeholder={placeholder} loading={initialLoading}>
          {classList.map((item) => (
            <div key={item.id} className='flex justify-between items-center p-4 bg-white rounded-lg mb-4 shadow-sm hover:cursor-pointer hover:shadow-md'>
              <div className='flex items-center'>
                <div className='bg-orange-300 h-16 w-16 flex justify-center items-center rounded-md mr-4'>
                  <GraduationCap size={40} color="#eee" fill='#ff7900'></GraduationCap>
                </div>
                <div>
                  <Title heading={5}>{item.class_name}</Title>
                  <p>{item.class_remark}</p>
                </div>
              </div>
              <Dropdown
                render={
                  <Dropdown.Menu>
                    <Dropdown.Item icon={<BookUser />} onClick={() => handleViewStudentsList(item.class_id)}>学生列表</Dropdown.Item>
                    <Dropdown.Item icon={<UserPlus />} onClick={() => handleInviteStudent(item.class_id)}>邀请学生</Dropdown.Item>
                    <Dropdown.Item icon={<Settings />} onClick={() => handleSetting(item)}>设置</Dropdown.Item>
                  </Dropdown.Menu>
                }
              >
                <Ellipsis />
              </Dropdown>
            </div>
          ))}
          {
            !initialLoading && classList?.length === 0 && (
              <Empty
                image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
                title="暂无班级"
                description="点击右上角“新建班级按钮”创建你的第一个班级吧！"
              >
              </Empty>
            )
          }
        </Skeleton>
      </div>
      <Modal title={curClass?.id ? '编辑班级信息' : '新建班级'}
        maskClosable={false}
        visible={visibleClass}
        style={{ width: 600 }}
        confirmLoading={editLoading}
        onOk={handleSubmitClass}
        onCancel={() => setVisibleClass(false)}>
        <Form ref={editClassFromRef} initValues={curClass}>
          <Form.Input rules={[
            { required: true, message: '请输入班级名称' }]}
            field="class_name"
            label='请为班级设置名称:' />
          <Form.TextArea maxCount={50} field="class_remark" label='请为班级添加备注（可选）'>
          </Form.TextArea>
        </Form>
      </Modal>
      <Modal title={`邀请学生加入班级: ${curInviteClass?.class_name}`}
        maskClosable={false}
        visible={visibleInvite}
        centered={true}
        style={{ width: 600 }}
        footer={null}
        onCancel={() => {
          setVisibleInvite(false)
          setCurInviteClass({})
          setIsInviteCodeExpired(false)
        }}
      >
        <Title heading={6}>请将下方邀请链接分享给您的学生,学生同意加入后将自动关联至该班级</Title>
        <div className='flex my-4'>
          <Input disabled validateStatus={isInviteCodeExpired ? 'error' : 'default'} value={`${origin}/${params.locale}/invite?code=${curInviteClass?.code}`} />
          {
            !isInviteCodeExpired ? <CopyToClipboard text={`${origin}/${params.locale}/invite?code=${curInviteClass?.code}`}
              onCopy={(_: any, result: any) => result && Toast.success('复制成功')}>
              <Button className='ml-2'>复制链接</Button>
            </CopyToClipboard> : <Button className='ml-2' onClick={() => updateInviteCode(curInviteClass.class_id)}>重新生成</Button>
          }
        </div>
        <div>
          {isInviteCodeExpired && <Paragraph className='mt-4 text-red-400'>链接已过期，请重新生成</Paragraph>}
          <div className='my-8'>
            <Title heading={6}>Tips：</Title>
            <Paragraph className='mt-4'>1.出于安全原因,<Text type="danger">链接的有效期为48小时</Text>,过期需要重新生成邀请链接</Paragraph>
            <Paragraph className='mt-2'>2.出于安全原因,只有学生同意加入后,班级与学生的绑定关系才正式生效</Paragraph>
          </div>
        </div>
      </Modal>
      <Modal maskClosable={false}
        onCancel={handleCancelViewStudents}
        title="学生列表"
        fullScreen
        visible={showStudents}
        footer={null}>
        <Table dataSource={studentList} loading={loadingStudent} rowKey='user_id' size="small" bordered={true}>
          <Column title='学生ID' width={150} dataIndex="user_id" />
          <Column title='邮箱' width={150} dataIndex="email" />
          <Column title='昵称(母语)' width={150} dataIndex="user_name" />
          <Column title='中文名' width={150} dataIndex="scientific_name" />
          <Column align='center' title='操作' width={80} dataIndex="option" render={(value, record, index) => (
            <Popconfirm
              title="确定移除当前学生"
              onConfirm={() => handleRemoveStudent(record.user_id)}
              position='bottomRight'
              onCancel={() => { }}
            >
              <Button theme='light' type='danger' size='small'>移除学生</Button>
            </Popconfirm>
          )} />
        </Table>
      </Modal>
    </section>
  );
}