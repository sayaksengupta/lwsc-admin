import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { authApi } from '../../../services/api'

const DeleteAccount = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in both email and password.')
      return
    }
    setError(null)
    setShowModal(true)
  }

  const confirmDeletion = async () => {
    setLoading(true)
    setError(null)
    try {
      await authApi.userDeleteAccount({ email, password })
      setSuccess(true)
      setShowModal(false)
      setEmail('')
      setPassword('')
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to delete account. Please check your credentials.')
      setShowModal(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Delete Account</h1>
                  <p className="text-medium-emphasis">
                    Request that your account and associated data is deleted from LWSC.
                  </p>
                  
                  {error && <CAlert color="danger">{error}</CAlert>}
                  {success && (
                    <CAlert color="success">
                      Your account and all associated data have been deleted successfully.
                    </CAlert>
                  )}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput 
                      placeholder="Email" 
                      autoComplete="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={success}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={success}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="danger" type="submit" disabled={success || loading}>
                      {loading ? 'Processing...' : 'Delete My Account'}
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>

      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Account Deletion</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete your account? This action is permanent and will remove all your data, including logs, profiles, and achievements.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={confirmDeletion} disabled={loading}>
            Yes, Delete Everything
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default DeleteAccount
