import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/LoginSugnup/Login";
import EducationalDetailsForm from "./components/Form/EducationalDetails";
import FamilyDetails from "./components/Form/FamilyDetails";

import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import BasicDetailsForm from "./components/Form/BasicDetails";
import BatchRelatedDetails from "./components/Form/BatchRelatedDetails";
import Signup from "./components/LoginSugnup/Signup";
import ExamDetails from "./components/ExamDetails";
import ShowMessage from "./components/ShowMessage";
import Dashboard from "./components/Dashboard";
import { Provider } from "react-redux";
import store from "./redux/store";
import ForgotPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";
import ResultPage from "./components/ResultPage";
import FormDetailPage from "./components/FormDetailPage";
import PaymentSuccessMessage from "./components/PaymentSuccessMessage";
import Spinner from "./api/Spinner";
import Payment from "./components/Payment"
import Result from "./components/Result";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="p-0 m-0">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/registration/educationalDetailsForm"
                element={< EducationalDetailsForm />}
              />
              <Route path="/registration/basicDetailsForm" element={<BasicDetailsForm />} />
             
              <Route
                path="/dashboard"
                element={<PrivateRoute component={Dashboard} />}
              />
              <Route path="/examDetails" element={<ExamDetails />} />
              <Route path="/showMessage" element={<ShowMessage />} />
              <Route path="/forgetPassword" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              {/* <Route path="result" element={<ResultPage />} /> */}
              <Route
                path="/FormDetailPage"
                element={<PrivateRoute component={FormDetailPage} />}
              />
              <Route
                path="/resultDetails"
                element={<PrivateRoute component={ResultPage} />}
              />
              <Route path="/payment" element={<Payment />} />
              {/* <Route
                path="/payment/success/:payment_id"
                element={<PrivateRoute component={PaymentSuccessMessage} />}
              /> */}
              <Route path="/result" element={<PrivateRoute component={Result}/>} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
