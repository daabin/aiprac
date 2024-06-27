import React, { useEffect, useRef, useState } from 'react';
import './QuestionMatchLine.css';
import MatchLine from '@likg/match-line';
import { Button, Toast } from '@douyinfe/semi-ui';
import _ from 'lodash';

const QuestionMatchLine = ({ dataSource, standardAnswers }: { dataSource: any, standardAnswers: any }) => {
  const [matchLine, setMatchLine] = useState<MatchLine | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const backCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // -- 初始化连线库
    if (canvasRef.current && backCanvasRef.current && containerRef.current) {
      const items = containerRef.current.querySelectorAll('.option');
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
      canvasRef.current = null;
      backCanvasRef.current = null;
      containerRef.current = null;
    }
  }, [dataSource, standardAnswers]);


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
      <div className="contents" ref={containerRef}>
        <div className="leftOptions">{renderItems('L')}</div>
        <div className="rightOptions">{renderItems('R')}</div>
        <canvas ref={canvasRef}></canvas>
        <canvas ref={backCanvasRef}></canvas>
      </div>
      <p className='my-2'>提示：点击左边文字后连接至对应右边文字</p>
      <div className="flex justify-center mt-4 gap-4">
        <Button onClick={() => matchLine?.reset()}>重置</Button>
        <Button onClick={() => matchLine?.undo()}>撤销</Button>
        <Button theme='solid' type='primary' onClick={handleCheck}>检查答案</Button>
      </div>
    </div>
  );
};

export default QuestionMatchLine;