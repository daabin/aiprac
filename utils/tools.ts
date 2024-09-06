import _ from 'lodash';

export function generateUniqueID() {
  const timestamp = new Date().getTime(); 
  const randomNum = Math.floor(Math.random() * 1000); 
  return timestamp + '' + randomNum;
}

export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 按创建时间判断班级邀请码是否过期
// 创建时间为UTC时间需加8小时
// 超过48小时则过期
export function isClassInviteCodeExpired(createdAt: string) {
  const now = new Date().getTime();
  const created = new Date(createdAt).getTime();
  return now - created > 48 * 60 * 60 * 1000;
}

export const formatUTCTimeToBeijinTime = (time: any) => {
  if (!time) return '';
  const date = new Date(time);
  date.setHours(date.getHours() + 8);
  return date.toLocaleString();
}

export const formatToBeijinTime = (time: any) => {
  if (!time) return '';
  const date = new Date(time);
  return date.toLocaleString('zh-CN', { hour12: false });
}

export const isEmpty = (ele: any) => {
  if (_.isObject(ele)) {
    return _.isEmpty(ele);
  } 
  return !ele;
}