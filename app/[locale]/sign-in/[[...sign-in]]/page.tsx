import { SignIn } from "@clerk/nextjs";
import styles from '@/styles/styles.module.css';

export default function Page() {
  return <div className={`w-screen h-screen flex justify-center items-center ${styles.pagebg}`}>
    <SignIn routing="hash" />
  </div>;
}