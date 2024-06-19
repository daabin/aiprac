import { Form, Button } from '@douyinfe/semi-ui';
import { useRef } from 'react';

export default function StepOne({ basicInfo, setBasicInfo, next }: { basicInfo: any, setBasicInfo: any, next: any }) {
  const formRef = useRef<any>(null);

  const handleNext = () => {
    formRef.current.formApi.validate().then((valid: boolean) => {
      if (!valid) {
        return;
      }
      setBasicInfo(formRef.current.formApi.getValues());
      next();
    })
  }

  return (
    <section className='flex-1 flex flex-col justify-between'>
      <Form ref={formRef} initValues={basicInfo}>
        <Form.Input trigger='blur' field='title' label='为本次练习起一个名字' placeholder='例如：xxx 课程 xxx 节课后练习' rules={[
          { required: true, message: '名字为必填项' },
        ]}></Form.Input>
        <Form.TextArea field='description' label='关于练习的叮嘱或说明，可以填写在下方（可选）' placeholder='例如：作业的提交时间，需要背诵的课文'></Form.TextArea>
      </Form>
      <div className="flex justify-end py-4">
        <Button size="large" theme="solid" onClick={handleNext}>下一步</Button>
      </div>
    </section>
  );
}