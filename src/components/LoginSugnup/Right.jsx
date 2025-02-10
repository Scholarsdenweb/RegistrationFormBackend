import LoginSugnupPageImg from "../../assets/LoginSugnupPageImg.png";

const Right = () => {
  return (
    <div className="bg-white flex flex-col gap-10 w-full h-full pt-10 px-20 rounded-3xl">
      <div>
        <h2 className="text-3xl font-extrabold" style={{ color: "#c61d23" }}>
          Welcome to
        </h2>
        <p className="text-4xl font-light " style={{ color: "#c61d23" }}>
          Scholars Den student portal
        </p>
        <span>Login to access your account</span>
      </div>
      <div className="flex items-bottom pb-5 justify-center items-end my-auto w-full flex-1">
        <img className="w-2/3 h-2/3 " src={LoginSugnupPageImg} alt="" />
      </div>
    </div>
  );
};
export default Right;
