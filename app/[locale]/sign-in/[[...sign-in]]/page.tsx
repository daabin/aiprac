import { SignIn } from "@clerk/nextjs";

const sytles = {
  backgroundColor: ' #fcecde',
  backgroundImage: 'url(//cdn.baichuan-ai.com/build/_next/static/media/proposal-bg-2.9b741e50.png),url(//cdn.baichuan-ai.com/build/_next/static/media/proposal-bg-1.1c2491ce.png)',
  backgroundSize: '1021px 504px,729px 218px',
  backgroundPosition: '0 100%,100% 100%',
  backgroundRepeat: 'no-repeat'
}

export default function Page() {
  return <div className="w-screen h-screen flex justify-center items-center" style={sytles}>
    <SignIn routing="hash" />
  </div>;
}