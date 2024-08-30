'use client'
import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Toast } from '@douyinfe/semi-ui';

export default function AddUsername() {
  const [visible, setVisible] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const fromRef = React.createRef<any>();

  useEffect(() => {
    doInitial();
  }, []);

  // 判断用户是否已设置姓名信息
  const doInitial = async () => {
    const res = await fetch(`/api/users`, {
      method: 'GET',
      cache: 'no-store'
    });
    const data = await res.json();

    if (!data?.error && data?.data[0]) {
      const { user_name, scientific_name } = data?.data[0];
      if (!user_name || !scientific_name) {
        setVisible(true);
      }
    } 
  }

  const handleSubmit = async () => {
    fromRef.current.formApi.validate().then((values: any) => {
      console.log('values', values);
      doSubmit(values);
    }).catch((error: any) => {
      console.log('error', error);
    })
  }

  const doSubmit = async (values: any) => {
    setSaveLoading(true);
    const res = await fetch('/api/users', {
      method: 'PUT',
      body: JSON.stringify(values),
    });
    const data = await res.json();
    setSaveLoading(false);

    if (data?.error) {
      Toast.error('保存失败，请稍后重试');
    } else {
      Toast.success('保存成功');
      setVisible(false);
    }
  }

  return (
    <Modal title={'设置姓名信息'}
      maskClosable={false}
      visible={visible}
      style={{ width: 400 }}
      confirmLoading={saveLoading}
      onOk={handleSubmit}
      onCancel={() => setVisible(false)}
      >
      <Form ref={fromRef}>
        <Form.Input rules={[
          { required: true, message: '请输入你的母语昵称' }]}
          field="user_name"
          label='昵称（母语）' />
        <Form.Input rules={[
          { required: true, message: '请输入你的中文名' }]}
          field="scientific_name"
          label='中文名' />
      </Form>
    </Modal>
  );
}