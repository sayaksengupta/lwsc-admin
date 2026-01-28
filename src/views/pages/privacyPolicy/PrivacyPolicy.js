import React from 'react'
import { CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react'

const PrivacyPolicy = () => {
  return (
    <div className="bg-light min-vh-100 py-5">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={10} lg={8}>
            <CCard className="shadow-sm">
              <CCardBody className="p-5">
                <h1 className="mb-4">Privacy Policy</h1>
                <p className="text-muted">Last Updated: January 29, 2026</p>
                
                <section className="mb-4">
                  <h3>1. Introduction</h3>
                  <p>
                    Welcome to LWSC ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.
                  </p>
                </section>

                <section className="mb-4">
                  <h3>2. Information We Collect</h3>
                  <p>We collect information that you provide directly to us, including:</p>
                  <ul>
                    <li><strong>Account Information:</strong> Name, email address, password, and profile details.</li>
                    <li><strong>Health Data:</strong> Pain levels, mood logs, hydration data, and medication schedules.</li>
                    <li><strong>Child Profiles:</strong> Information about dependents added to your account.</li>
                    <li><strong>Location Data:</strong> Geographical locations for facility search (with your permission).</li>
                  </ul>
                </section>

                <section className="mb-4">
                  <h3>3. How We Use Your Information</h3>
                  <p>We use the collected information for various purposes:</p>
                  <ul>
                    <li>To provide and maintain our Service.</li>
                    <li>To notify you about changes to our Service.</li>
                    <li>To allow you to participate in interactive features.</li>
                    <li>To provide health tracking insights and rewards.</li>
                    <li>To provide customer support.</li>
                  </ul>
                </section>

                <section className="mb-4">
                  <h3>4. Data Sharing and Disclosure</h3>
                  <p>
                    We do not sell your personal data. We may share information with service providers who perform services for us (like database hosting) or when required by law.
                  </p>
                </section>

                <section className="mb-4">
                  <h3>5. Data Security</h3>
                  <p>
                    We implement appropriate technical and organizational security measures to protect the security of any personal information we process. however, please remember that no method of transmission over the internet is 100% secure.
                  </p>
                </section>

                <section className="mb-4">
                  <h3>6. Your Rights and Data Deletion</h3>
                  <p>
                    You have the right to access, update, or delete your personal information. You can request account deletion directly through our dedicated <a href="/delete-account">Delete Account</a> page. Upon request, all your personal data, logs, and profiles will be permanently removed from our active databases.
                  </p>
                </section>

                <section className="mb-4">
                  <h3>7. Contact Us</h3>
                  <p>
                    If you have questions or comments about this policy, you may contact us at support@lwsc-app.com.
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

export default PrivacyPolicy
