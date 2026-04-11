import TeamLogin from "./TeamLogin";
import TeamSignUp from "./TeamSignup";


export default function LoginSignUp({ isLogin, setIsLogin, isSignUp, setSignUp,switchModalType }) {
    return (
        <div className="bg-white rounded-[20px] py-[10px] justify-center mt-[20px]">
        {isLogin ? (
          <>
            <TeamLogin switchModalType={switchModalType}/>
          </>
        ) : (
          <>
            {isSignUp ? (
              <TeamSignUp switchModalType={switchModalType}/>
            ) : (
              "hiiiiiii"
            )}
          </>
        )}
      </div>
    );
  }
  