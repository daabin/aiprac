import React, { useEffect, useMemo, useRef, useState } from 'react';
import './QuestionMatchLine.css';
import MatchLine from './match-line';
import { Button, ButtonGroup, Tooltip } from '@douyinfe/semi-ui';
import { IconRefresh } from '@douyinfe/semi-icons';
import _ from 'lodash';
import { SHOW_STUDENT_ANSWER_STATUS } from '@/utils/constants'

const QuestionMatchLine = ({ qid, dataSource, standardAnswers, showAnswer, studentAnswer, handleUpdateStudentAnswer, homeworkStatus }: { qid: any, dataSource: any, standardAnswers: any, showAnswer: boolean, studentAnswer: any, handleUpdateStudentAnswer: any, homeworkStatus: any }) => {
  const [matchLine, setMatchLine] = useState<MatchLine | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const backCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // -- 初始化连线库
    if (canvasRef.current && backCanvasRef.current && containerRef.current) {
      const items = containerRef.current.querySelectorAll('.option');
      console.log(studentAnswer[qid], 'studentAnswer[qid] ----')
      if (items.length > 0) {
        const params: any = {
          container: containerRef.current,
          items: items as NodeListOf<HTMLElement>,
          canvas: canvasRef.current,
          backCanvas: backCanvasRef.current,
          strokeStyle: '#ff7900',
          itemActiveCls: 'active',
          debug: false,
          onChange: (answers: any) => {
            console.log('answers', qid, answers)
            handleUpdateStudentAnswer(qid, answers)
          },
        }

        if (SHOW_STUDENT_ANSWER_STATUS.includes(homeworkStatus)) {
          params.answers = studentAnswer[qid]
          params.standardAnswers = standardAnswers
        }

        const matching = new MatchLine(params);

        setMatchLine(matching);
      }
    }

    return () => {
      matchLine?.reset()
    }
  }, []);

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
      <div className='mt-2  flex justify-between items-center p-1 bg-slate-50'>
        <div className='flex items-center'><p>提示：点击左边文字，按住鼠标拖动连接至右边文字</p></div>
        <ButtonGroup size='small' >
          <Tooltip content="撤销重做">
            <Button type="tertiary" disabled={homeworkStatus !== 'ASSIGNED'} icon={<IconRefresh />} onClick={() => {
              handleUpdateStudentAnswer(qid, null)
              matchLine?.reset()
            }}></Button>
          </Tooltip>
        </ButtonGroup>
      </div>
      <div className="contents" ref={containerRef}>
        <div className="leftOptions">{renderItems('L')}</div>
        <div className="rightOptions">{renderItems('R')}</div>
        <canvas ref={canvasRef}></canvas>
        <canvas ref={backCanvasRef}></canvas>
      </div>
      {showAnswer && <div className='mt-4 p-4 border-4 border-orange-400 border-double'>
        ✅ 正确答案是：
        <ol>
          {
            Object.keys(standardAnswers).map((key, index) => (
              <li key={index}>{key} - {standardAnswers[key]} &nbsp;</li>
            ))
          }
        </ol>
      </div>}
    </div>
  );
};

export default QuestionMatchLine;