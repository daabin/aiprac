import React, { useEffect, useRef, useState } from 'react';
import './QuestionMatchLine.css';
import MatchLine from './match-line';
import { Button, Toast } from '@douyinfe/semi-ui';
import { IconHelpCircle } from '@douyinfe/semi-icons';
import _ from 'lodash';

const QuestionMatchLine = ({ qid, dataSource, standardAnswers }: { qid: any, dataSource: any, standardAnswers: any }) => {
  const [matchLine, setMatchLine] = useState<MatchLine | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const backCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    console.log('standardAnswers', standardAnswers);
    // -- 初始化连线库
    if (canvasRef.current && backCanvasRef.current && containerRef.current) {
      const items = containerRef.current.querySelectorAll('.option');
      console.log('初始化连线库', items);
      if (items.length > 0) {
        const matching = new MatchLine({
          container: containerRef.current,
          items: items as NodeListOf<HTMLElement>,
          canvas: canvasRef.current,
          backCanvas: backCanvasRef.current,
          strokeStyle: '#ff7900',
          itemActiveCls: 'active',
          standardAnswers,
          debug: true,
          onChange: (anwsers) => {
            console.log(anwsers);
          },
        });
        setMatchLine(matching);
      }
    }

    return () => {
      console.log('清除连线库');
      matchLine?.reset()
    }
  }, [dataSource, standardAnswers, qid]);


  const handleCheck = () => {
    const answers = matchLine?.getAnswers() || {}

    // 去除 answers key 中 (xxx) 的内容
    const formatAnswer = {}
    Object.keys(answers).map(key => {
      formatAnswer[key.replace(/\(.*\)/, '')] = answers[key]
    })

    // _.mapValues(answers, (value, key) => key.replace(/\(.*\)/, ''))

    // 将对象数组转化为对象
    console.log(formatAnswer, standardAnswers)

    // 判断两个对象是否相等
    if (_.isEqual(formatAnswer, standardAnswers)) {
      Toast.success('回答正确')
    } else {
      Toast.error(`回答错误, 正确答案是：${JSON.stringify(standardAnswers)}`)
    }
  }

  const renderItems = (ownership: 'L' | 'R') => {
    const k = ownership === 'L' ? 'leftOption' : 'rightOption';
    return dataSource.map((item: any, index: number) => (
      <div
        className="option"
        key={index}
        data-value={item[k]}
        data-ownership={ownership}
      >
        {item[k]}
      </div>
    ));
  };
  return (
    <div className="match-line">
      <div className='my-2 flex items-center'><IconHelpCircle className='mr-1' /><p> 使用提示：点击左边文字，按住鼠标拖动，连接至右边对应文字</p></div>
      <div className="contents" ref={containerRef}>
        <div className="leftOptions">{renderItems('L')}</div>
        <div className="rightOptions">{renderItems('R')}</div>
        <canvas ref={canvasRef}></canvas>
        <canvas ref={backCanvasRef}></canvas>
      </div>
      <div className="flex justify-center mt-4 gap-4">
        <Button onClick={() => matchLine?.reset()}>重置</Button>
        <Button onClick={() => matchLine?.undo()}>撤销</Button>
      </div>
      <div className='mt-4 p-4 border-4 border-orange-400 border-double'>
        ✅ 正确答案是：
        <ol>
          {
            Object.keys(standardAnswers).map((key, index) => (
              <li key={index}>{key} - {standardAnswers[key]} &nbsp;</li>
            ))
          }
        </ol>
      </div>
    </div>
  );
};

export default QuestionMatchLine;