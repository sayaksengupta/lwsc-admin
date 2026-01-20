import React, { useState, useEffect } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CCardFooter,
} from "@coreui/react";
import { useSelector, useDispatch } from "react-redux";
import { authApi } from "src/services/api";
import { toast, ToastContainer } from "react-toastify";
import CIcon from "@coreui/icons-react";
import { cilLowVision, cilFindInPage } from "@coreui/icons";

const Profile = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.userProfile);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData((prev) => ({
        ...prev,
        name: userProfile.name || "",
        email: userProfile.email || "",
      }));
    }
  }, [userProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }

      await authApi.updateProfile(updateData);

      toast.success("Profile updated successfully");
      
      // Update Redux state with new profile data (excluding password)
      const updatedProfile = { ...userProfile, name: formData.name, email: formData.email };
      dispatch({ type: "setProfile", profile: updatedProfile });
      
      // Clear password fields
      setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CContainer className="py-4">
      <ToastContainer />
      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCard className="shadow-sm">
            <CCardHeader className="border-bottom-0 pt-4 px-4" style={{ backgroundColor: 'transparent' }}>
              <h4 className="mb-0" style={{ color: 'var(--cui-body-color)' }}>Edit Profile</h4>
              <p className="small" style={{ color: 'var(--cui-body-color)' }}>Manage your account information and password.</p>
            </CCardHeader>
            <CCardBody className="p-4">
              <CForm onSubmit={handleSubmit}>
                <CRow className="mb-4">
                  <CCol md={6}>
                    <CFormLabel htmlFor="name" style={{ color: 'var(--cui-body-color)' }}>Full Name</CFormLabel>
                    <CFormInput
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="email" style={{ color: 'var(--cui-body-color)' }}>Email Address</CFormLabel>
                    <CFormInput
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                </CRow>

                <hr className="my-4 opacity-10" />

                <h5 className="mb-3" style={{ color: 'var(--cui-body-color)' }}>Change Password</h5>
                <p className="small mb-4 italic" style={{ color: 'var(--cui-body-color)' }}>Leave blank if you don't want to change it.</p>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="password" style={{ color: 'var(--cui-body-color)' }}>New Password</CFormLabel>
                    <div style={{ position: 'relative' }}>
                      <CFormInput
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Enter new password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ paddingRight: '40px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--cui-body-color)'
                        }}
                      >
                       {showPassword ? <CIcon icon={cilLowVision} /> : <CIcon icon={cilFindInPage} />}
                      </button>
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="confirmPassword" style={{ color: 'var(--cui-body-color)' }}>Confirm New Password</CFormLabel>
                    <div style={{ position: 'relative' }}>
                      <CFormInput
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={{ paddingRight: '40px' }}
                      />
                       <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--cui-body-color)'
                        }}
                      >
                       {showPassword ? <CIcon icon={cilLowVision} /> : <CIcon icon={cilFindInPage} />}
                      </button>
                    </div>
                  </CCol>
                </CRow>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-5">
                  <CButton 
                    type="submit" 
                    color="primary" 
                    className="px-5 py-2"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Save Changes"}
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Profile;