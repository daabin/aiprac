export enum RoleCode {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export const QuestionDifficulty = ['零基础', 'HSK1', 'HSK2', 'HSK3']
export const AbilityEnabled = ['词汇', '听力', '口语']
export const QuestionTypeEnabled = ['看图认字', '词汇匹配', '字词填空', '听力选择', '口语发音']
export const PreviewStatus = ['成功', '部分成功']
export const timeoutConf = 1000 * 60 * 3