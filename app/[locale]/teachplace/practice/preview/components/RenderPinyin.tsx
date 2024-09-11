export default function RenderPinyin({ text = '', pinyin = '' }: { text: string, pinyin: string }) {
  const zh = text.replace(/[\s.。]/g, '').split('')
  const py = pinyin.replace(/[_,.，。]/g, ' ').replace(/\s+/g, ' ').split(' ')

  let result = ''
  let j = 0
  for (let i = 0; i < zh.length; i++) {
    if (/[,.，。_]/.test(zh[i])) {
      result += zh[i]
      continue
    }
   result += `<ruby key=${i}>${zh[i]}<rt>${py[j]}</rt></ruby>`
   j++
  }

  return <span dangerouslySetInnerHTML={{__html: result}}></span>
}