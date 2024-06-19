
import { Typography, Button } from '@douyinfe/semi-ui';
import { Spin } from '@douyinfe/semi-ui';
import { IconLoading } from '@douyinfe/semi-icons';

export default function StepOne() {
  const { Title } = Typography;

  const handleCancel = () => {
    // todo
  }

  return (
    <div className="h-full flex flex-col items-center mt-10">
        <Spin indicator={<IconLoading size="extra-large"/>} />
        <Title heading={5} style={{margin: "20px 0", color: 'rgb(127 29 29)'}}>正在为你生成第 {6} / 10 个题目......</Title>
        <Button type="warning" onClick={handleCancel}>取消生成</Button>
    </div>
  )
}