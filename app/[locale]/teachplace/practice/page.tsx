'use client'
import { Tabs, TabPane } from '@douyinfe/semi-ui';
import { IconSendMsgStroked, IconChecklistStroked } from '@douyinfe/semi-icons';
import { Sparkles } from 'lucide-react';
import Assign from './components/Assign';
import Correct from './components/Correct';
import Create from './components/Create/index';
import './style.css';

export default function PracticePage() {
  return (
    <Tabs
      tabPosition="top"
      defaultActiveKey="1"
      tabPaneMotion={false}
      className='flex h-full flex-col aiprac-tab'
    >
      <TabPane tab={
        <span>
          <IconSendMsgStroked />
          布置作业
        </span>
      } itemKey="1" >
        <Assign />
      </TabPane>
      <TabPane tab={
        <span>
          <IconChecklistStroked />
          批改作业
        </span>
      } itemKey="2" >
        <Correct />
      </TabPane>
      <TabPane className='h-full flex-1' tab={
        <span className='flex items-center'>
          <Sparkles size={16} color="orange" className="mr-1"/>
          AI 出题
        </span>}
        itemKey="3" >
        <Create/>
      </TabPane>
    </Tabs>
  );
}