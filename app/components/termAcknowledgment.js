import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function TermsAcknowledgment({buttonText,termsPageRoute}) {
  const router = useRouter();
    const {setLoadingNewPage}=useAuth()
  return (
    <div className="text-[12px] text-center text-gray-600 pb-[10px]">
      By clicking <strong>"{buttonText}"</strong>, you hereby acknowledge that you agree to our{" "}
      <span
        className="font-bold underline hover:no-underline cursor-pointer"
        onClick={() => {setLoadingNewPage(true);router.push("/privacyPolicy")}}
      >
        privacy policy
      </span>{" "}
      and{" "}
      <span
        className="font-bold underline hover:no-underline cursor-pointer"
        onClick={() => {setLoadingNewPage(true);router.push(`/${termsPageRoute}`)}}
      >
        terms and conditions
      </span>.
    </div>
  );
}
