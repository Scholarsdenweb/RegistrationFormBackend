import Right from "./Right";
import SignupRight from "./SignupRight";

const Signup = () => {
  return (
    <div
      className="grid grid-cols-12 justify-between items-center h-screen"
      style={{ backgroundColor: "#c61d23" }}
    >
        <div className="col-span-5 gap-3 ">
          <SignupRight />
        </div>
        <div className="col-span-7 flex justify-center p-6 w-full h-full">
          <Right />
        </div>
    </div>
  );
};
export default Signup;
