import TextElement from '@components/TextElement/TextElement';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import classes from './legal.module.scss';

export default function PrivacyPolicy() {
  return (
    <main className={classes.privacyPolicy}>
      <ContentWrapper
        className={classes.wrapper}
        asWrapperSection
        sectionClass={classes.wrapperSection}
      >
        <div className={classes.title}>
          <TextElement type={'heading-lg'} as={'h1'}>
            Privacy Policy
          </TextElement>
        </div>
        <p>
          <strong>Last updated: 12. February, 2025</strong>
        </p>
        <ol>
          <li>
            <strong> Introduction</strong>
          </li>
        </ol>
        <p>
          <span>
            Your trust in providing us with your personal information is our
            utmost priority. Ixian Foundation ("Ixian," "we," "our," or "us") is
            committed to protecting your personal data and maintaining the
            highest level of security. This Privacy Policy outlines how we
            collect, use, store, and protect your personal information when you
            access and use our website ("Website").
          </span>
        </p>
        <p>
          <span>
            By using this Website, you agree to the terms of this Privacy
            Policy. If you do not agree, please discontinue use of the Website
            immediately.
          </span>
        </p>
        <ol start={2}>
          <li>
            <strong> Data We Collect</strong>
          </li>
        </ol>
        <p>
          <span>
            When you use the Website, we may collect the following types of
            information:
          </span>
        </p>
        <ul>
          <li>
            <strong>Personal Information</strong>
            <span>
              : If you contact us via email or forms, we may collect your name,
              email address, and any other information you provide.
            </span>
          </li>
          <li>
            <strong>Technical Data</strong>
            <span>
              : We collect information about your device, IP address, browser
              type, and operating system for security and analytics purposes.
            </span>
          </li>
          <li>
            <strong>Log Data</strong>
            <span>
              : This includes details such as your IP address, the pages you
              visit, the time and date of your visit, the time spent on those
              pages, and other website usage statistics.
            </span>
          </li>
          <li>
            <strong>Cookies and Tracking Data</strong>
            <span>
              : We use cookies to improve user experience and analyze website
              traffic. You can manage your cookie preferences in your browser
              settings.
            </span>
          </li>
          <li>
            <strong>Demographic Information</strong>
            <span>
              : We may collect non-personally identifiable information such as
              age, gender, and postal code for statistical and service
              improvement purposes.
            </span>
          </li>
        </ul>
        <p>
          <span>
            If you wish to request the deletion of your personal data, you may
            contact us at{' '}
          </span>
          <strong>info@ixian.io</strong>
          <span>, and your personal information will be deleted within </span>
          <strong>14 days</strong>
          <span>.</span>
        </p>
        <ol start={3}>
          <li>
            <strong> How We Use Your Data</strong>
          </li>
        </ol>
        <p>
          <span>We use your data for the following purposes:</span>
        </p>
        <ul>
          <li>
            <span>To provide and improve the Website’s functionality.</span>
          </li>
          <li>
            <span>To identify and authenticate users.</span>
          </li>
          <li>
            <span>To respond to inquiries and provide customer support.</span>
          </li>
          <li>
            <span>To enhance security and prevent fraudulent activities.</span>
          </li>
          <li>
            <span>
              To analyze Website traffic and trends to improve user experience.
            </span>
          </li>
          <li>
            <span>
              To send newsletters, promotional emails, and updates about our
              services (you may opt-out at any time).
            </span>
          </li>
        </ul>
        <p>
          <span>
            We do not sell or rent your personal data. Information is only
            shared with third parties as outlined in Section 4.
          </span>
        </p>
        <ol start={4}>
          <li>
            <strong> Data Sharing and Third Parties</strong>
          </li>
        </ol>
        <p>
          <span>
            We do not sell or distribute your personal data to third parties for
            commercial purposes. However, we may share data in the following
            circumstances:
          </span>
        </p>
        <ul>
          <li>
            <span>With </span>
            <strong>service providers</strong>
            <span>
              {' '}
              that assist us in operating the Website (e.g., hosting services,
              analytics tools), bound by confidentiality agreements.
            </span>
          </li>
          <li>
            <span>If required by </span>
            <strong>
              law enforcement, regulatory authorities, or legal proceedings
            </strong>
            <span>.</span>
          </li>
          <li>
            <span>In the event of a </span>
            <strong>business restructuring, merger, or acquisition</strong>
            <span>, your data may be transferred to a new entity.</span>
          </li>
        </ul>
        <ol start={5}>
          <li>
            <strong> Data Security</strong>
          </li>
        </ol>
        <p>
          <span>
            We implement appropriate technical and organizational security
            measures to protect your personal data from unauthorized access,
            loss, misuse, or disclosure. However, no system is entirely secure,
            and we cannot guarantee absolute security.
          </span>
        </p>
        <ol start={6}>
          <li>
            <strong> Your Rights</strong>
          </li>
        </ol>
        <p>
          <span>
            Depending on applicable laws, you may have the following rights
            regarding your data:
          </span>
        </p>
        <ul>
          <li>
            <strong>Right to Access</strong>
            <span>
              : Request a copy of the personal data we hold about you.
            </span>
          </li>
          <li>
            <strong>Right to Correction</strong>
            <span>: Request corrections to inaccurate or incomplete data.</span>
          </li>
          <li>
            <strong>Right to Deletion</strong>
            <span>
              : Request the deletion of your personal data under certain
              conditions.
            </span>
          </li>
          <li>
            <strong>Right to Restriction</strong>
            <span>
              : Request limitation of data processing in specific cases.
            </span>
          </li>
          <li>
            <strong>Right to Object</strong>
            <span>
              : Object to processing of your personal data based on legitimate
              interests.
            </span>
          </li>
          <li>
            <strong>Right to Withdraw Consent</strong>
            <span>
              : Withdraw your consent for processing your personal data at any
              time.
            </span>
          </li>
        </ul>
        <p>
          <span>To exercise these rights, please contact us at </span>
          <strong>info@ixian.io</strong>
          <span>.</span>
        </p>
        <ol start={7}>
          <li>
            <strong> Data Retention</strong>
          </li>
        </ol>
        <p>
          <span>
            We retain personal data only as long as necessary for the purposes
            outlined in this policy or as required by law. Once no longer
            needed, we securely delete or anonymize your data.
          </span>
        </p>
        <ol start={8}>
          <li>
            <strong> International Data Transfers</strong>
          </li>
        </ol>
        <p>
          <span>
            If data is transferred outside of Slovenia or the European Economic
            Area (EEA), we ensure adequate data protection safeguards are in
            place.
          </span>
        </p>
        <ol start={9}>
          <li>
            <strong> Cookies and Tracking Technologies</strong>
          </li>
        </ol>
        <p>
          <span>
            Our Website uses cookies and similar tracking technologies to
            improve user experience and analyze Website traffic. You can manage
            cookie settings in your browser or refer to our{' '}
          </span>
          <strong>Cookie Policy</strong>
          <span> for more details.</span>
        </p>
        <ol start={10}>
          <li>
            <strong> Third-Party Websites and Services</strong>
          </li>
        </ol>
        <p>
          <span>
            Our Website may contain links to third-party websites, including but
            not limited to Facebook, LinkedIn, GitHub, and Twitter. Please note
            that these external sites are not operated by Ixian. We strongly
            advise you to review the privacy policies of any third-party
            websites you visit. Ixian is not responsible for the content,
            privacy policies, or practices of any third-party sites or services.
          </span>
        </p>
        <ol start={11}>
          <li>
            <strong> Governing Law and Jurisdiction</strong>
          </li>
        </ol>
        <p>
          <span>This Privacy Policy is governed by the laws of </span>
          <strong>Slovenia</strong>
          <span>
            . Any disputes related to this Privacy Policy shall be subject to
            the exclusive jurisdiction of the courts in Slovenia.
          </span>
        </p>
        <ol start={12}>
          <li>
            <strong> Changes to this Privacy Policy</strong>
          </li>
        </ol>
        <p>
          <span>
            Ixian reserves the right to update this Privacy Policy at any time.
            Changes will be posted on the Website, and continued use constitutes
            acceptance of the updated policy.
          </span>
        </p>
        <ol start={13}>
          <li>
            <strong> Contact Us</strong>
          </li>
        </ol>
        <p>
          <span>
            For questions or concerns about this Privacy Policy, contact us at{' '}
          </span>
          <strong>info@ixian.io</strong>
          <span>.</span>
        </p>
      </ContentWrapper>
    </main>
  );
}
