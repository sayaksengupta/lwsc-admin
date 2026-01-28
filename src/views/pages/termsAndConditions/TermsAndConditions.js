import React from 'react'
import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react'

const TermsAndConditions = () => {
  return (
    <div className="bg-light min-vh-100 py-5">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={10} lg={8}>
            <CCard className="shadow-sm">
              <CCardBody className="p-5">
                <h1 className="mb-4">Terms and Conditions</h1>
                <p className="text-muted">Last Updated: January 29, 2026</p>

                <section className="mb-4">
                  <h3>1. Agreement to Terms</h3>
                  <p>
                    By accessing or using the LWSC app, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the service.
                  </p>
                </section>

                <section className="mb-4">
                  <h3>2. Description of Service</h3>
                  <p>
                    LWSC is a health management platform designed for tracking pain, mood, hydration, and medications. It is not a medical device and should not be used as a substitute for professional medical advice, diagnosis, or treatment.
                  </p>
                </section>

                <section className="mb-4">
                  <h3>3. User Accounts</h3>
                  <p>
                    When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the terms, which may result in immediate termination of your account on our service.
                  </p>
                </section>

                <section className="mb-4">
                  <h3>4. User Responsibilities</h3>
                  <p>
                    Users are responsible for maintaining the confidentiality of their account and password. You agree to accept responsibility for any and all activities or actions that occur under your account.
                  </p>
                </section>

                <section className="mb-4">
                  <h3>5. Intellectual Property</h3>
                  <p>
                    The service and its original content, features, and functionality are and will remain the exclusive property of LWSC and its licensors.
                  </p>
                </section>

                <section className="mb-4">
                  <h3>6. Termination</h3>
                  <p>
                    We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the terms.
                  </p>
                </section>

                <section className="mb-4">
                  <h3>7. Limitation of Liability</h3>
                  <p>
                    In no event shall LWSC, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
                  </p>
                </section>

                <section className="mb-4">
                  <h3>8. Governing Law</h3>
                  <p>
                    These terms shall be governed and construed in accordance with the laws of your jurisdiction, without regard to its conflict of law provisions.
                  </p>
                </section>

                <section className="mb-4">
                  <h3>9. Changes to Terms</h3>
                  <p>
                    We reserve the right, at our sole discretion, to modify or replace these terms at any time. We will provide at least 30 days' notice before any new terms taking effect.
                  </p>
                </section>

                <section className="mb-4">
                  <h3>10. Contact Us</h3>
                  <p>
                    If you have any questions about these Terms, please contact us at support@lwsc-app.com.
                  </p>
                </section>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default TermsAndConditions
