export default function RenderPinyin({ text, pinyin }: { text: string, pinyin: string }) {
  const zh = text.split('')
  const py = pinyin.split(' ')
  let result = ''
  for (let i = 0; i < zh.length; i++) {
   result += `<ruby key=${i}>${zh[i]}<rt>${py[i]}</rt></ruby>`
  }

  console.log('result------->', result)
  return <span dangerouslySetInnerHTML={{__html: result}}></span>
}