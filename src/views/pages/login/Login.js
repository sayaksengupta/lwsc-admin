import { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import logo from "../../../assets/logo.svg";
import bg from "../../../assets/images/dashboard.jpg";
import { authApi } from "src/services/api";

const Login = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState("login"); // login, forgot
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill all fields");
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });
      const { accessToken, token, refreshToken } = response.data;
      const finalToken = accessToken || token;

      localStorage.setItem("token", finalToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      
      toast.success("Login successful!");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    setLoading(true);

    try {
      await authApi.forgotPassword({ email });
      toast.success("Reset link sent to your email");
      setView("login");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <>
      <ToastContainer />
      <div
        className="min-vh-100 d-flex flex-row align-items-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(0, 0, 0, 0.7)), url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={6}>
              <CCardGroup>
                <CCard
                  className="p-4"
                  style={{
                    background: "#fffff9",
                    boxShadow: "1px 1px 10px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <CCardBody>
                    <div className="d-flex justify-content-center mb-4">
                      <img src={logo} alt="Logo" style={{ width: "180px" }} />
                    </div>

                    {view === "login" ? (
                      <CForm onSubmit={handleLogin}>
                        <h2 className="text-black">Login</h2>
                        <p className="text-body-secondary">Sign in to your account</p>

                        <CInputGroup className="mb-2">
                          <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                          <CFormInput
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </CInputGroup>

                        <CInputGroup className="mb-3">
                          <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
                          <CFormInput
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </CInputGroup>

                        <CRow className="align-items-center">
                          <CCol xs={6}>
                            <CButton color="primary" className="px-4" type="submit" disabled={loading}>
                              {loading ? "Logging in..." : "Login"}
                            </CButton>
                          </CCol>
                          <CCol xs={6} className="text-end">
                            <CButton 
                              color="link" 
                              className="px-0 text-decoration-none" 
                              onClick={() => setView("forgot")}
                            >
                              Forgot password?
                            </CButton>
                          </CCol>
                        </CRow>
                      </CForm>
                    ) : (
                      <CForm onSubmit={handleForgotPassword}>
                        <h2 className="text-black">Forgot Password</h2>
                        <p className="text-body-secondary">Enter your email to receive a reset link.</p>
                        
                        <CInputGroup className="mb-3">
                          <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                          <CFormInput
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </CInputGroup>

                        <CButton color="primary" className="px-4 w-100" type="submit" disabled={loading}>
                          {loading ? "Sending..." : "Send Reset Link"}
                        </CButton>
                        <div className="text-center mt-3">
                          <CButton color="link" onClick={() => setView("login")}>Back to login</CButton>
                        </div>
                      </CForm>
                    )}
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  );
};

export default Login;
