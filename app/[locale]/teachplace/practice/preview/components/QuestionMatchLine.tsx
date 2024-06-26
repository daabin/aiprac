import React, { useEffect, useRef, useState } from 'react';
import './QuestionMatchLine.css';
import MatchLine from '@likg/match-line';

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
      <div className="tools">
        <button onClick={() => matchLine?.reset()}>重置</button>
        <button onClick={() => matchLine?.undo()}>撤销</button>
      </div>
      <div className="contents" ref={containerRef}>
        <div className="leftOptions">{renderItems('L')}</div>
        <div className="rightOptions">{renderItems('R')}</div>
        <canvas ref={canvasRef}></canvas>
        <canvas ref={backCanvasRef}></canvas>
      </div>
      <p className='my-2'>提示：点击左边文字后连接至对应右边文字</p>
    </div>
  );
};

export default QuestionMatchLine;