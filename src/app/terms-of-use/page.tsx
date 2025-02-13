import TextElement from '@components/TextElement/TextElement';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import classes from '../privacy-policy/legal.module.scss';

export default function TermsOfUse() {
  return (
    <main className={classes.privacyPolicy}>
      <ContentWrapper
        className={classes.wrapper}
        asWrapperSection
        sectionClass={classes.wrapperSection}
      >
        <div className={classes.title}>
          <TextElement type={'heading-lg'} as={'h1'}>
            Terms of Use
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
          <span style={{ fontWeight: 400 }}>
            Welcome to the Ixian website ("Website"). The Website is operated by{' '}
          </span>
          <strong>Ixian Foundation</strong>
          <span style={{ fontWeight: 400 }}>
            {' '}
            ("Ixian," "we," "our," or "us"). By accessing or using this Website,
            you acknowledge that you have read, understood, and agree to be
            bound by these Terms of Use ("Terms"). If you do not agree with
            these Terms, you must discontinue use of the Website immediately.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            These Terms govern the use of the Website, including all content,
            information, and materials provided by Ixian. Additional terms may
            apply to specific services or downloadable software provided through
            the Website.
          </span>
        </p>
        <ol start={2}>
          <li>
            <strong> Acceptance of Terms</strong>
          </li>
        </ol>
        <p>
          <span style={{ fontWeight: 400 }}>
            By using this Website, you agree to comply with these Terms, our
            Privacy Policy, and our Cookie Policy. If you do not accept any of
            these terms, please refrain from using the Website.
          </span>
        </p>
        <ol start={3}>
          <li>
            <strong> Use of the Website</strong>
          </li>
        </ol>
        <p>
          <span style={{ fontWeight: 400 }}>
            Ixian grants you a personal, limited, non-exclusive,
            non-transferable, and revocable license to access and use the
            Website for lawful, non-commercial purposes. You agree not to:
          </span>
        </p>
        <ul>
          <li style={{ fontWeight: 400 }}>
            <span style={{ fontWeight: 400 }}>
              Use the Website for any unlawful, harmful, or fraudulent
              activities.
            </span>
          </li>
          <li style={{ fontWeight: 400 }}>
            <span style={{ fontWeight: 400 }}>
              Interfere with the operation of the Website, attempt unauthorized
              access, or use automated systems to extract data.
            </span>
          </li>
          <li style={{ fontWeight: 400 }}>
            <span style={{ fontWeight: 400 }}>
              Republish, sell, rent, or sublicense Website content without prior
              written consent from Ixian.
            </span>
          </li>
        </ul>
        <p>
          <span style={{ fontWeight: 400 }}>
            Ixian reserves the right to investigate violations and take
            appropriate legal action.
          </span>
        </p>
        <ol start={4}>
          <li>
            <strong> Downloadable Software and Open-Source Licenses</strong>
          </li>
        </ol>
        <p>
          <span style={{ fontWeight: 400 }}>
            Certain software, including Ixian DLT node software and Spixi, may
            be available for download on the Website. Usage of these software
            products may be subject to additional open-source or proprietary
            licensing agreements, which must be reviewed before installation or
            use.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            Ixian does not guarantee that downloadable software will function
            without errors or security vulnerabilities. You acknowledge that you
            use such software{' '}
          </span>
          <strong>at your own risk</strong>
          <span style={{ fontWeight: 400 }}>
            {' '}
            and that Ixian bears no responsibility for any damages resulting
            from its use.
          </span>
        </p>
        <ol start={5}>
          <li>
            <strong> Intellectual Property Rights</strong>
          </li>
        </ol>
        <p>
          <span style={{ fontWeight: 400 }}>
            The Website and its contents, including but not limited to text,
            logos, graphics, and trademarks, are the property of Ixian or its
            licensors and are protected by applicable copyright and trademark
            laws. You may not use Ixian’s trademarks, brand name, or logos
            without prior written permission.
          </span>
        </p>
        <p>
          <span style={{ fontWeight: 400 }}>
            If the software provided on the Website is open-source, it may be
            governed by its own licensing terms, which will take precedence over
            these Terms where applicable.
          </span>
        </p>
        <ol start={6}>
          <li>
            <strong> Limitation of Liability</strong>
          </li>
        </ol>
        <p>
          <span style={{ fontWeight: 400 }}>
            To the maximum extent permitted by law, Ixian disclaims all
            warranties and liability related to:
          </span>
        </p>
        <ul>
          <li style={{ fontWeight: 400 }}>
            <span style={{ fontWeight: 400 }}>
              The accuracy, reliability, or availability of information provided
              on the Website.
            </span>
          </li>
          <li style={{ fontWeight: 400 }}>
            <span style={{ fontWeight: 400 }}>
              Any damages resulting from the use or inability to use the Website
              or its content.
            </span>
          </li>
          <li style={{ fontWeight: 400 }}>
            <span style={{ fontWeight: 400 }}>
              Any security breaches, data loss, or financial losses incurred
              while using Ixian services or software.
            </span>
          </li>
        </ul>
        <p>
          <span style={{ fontWeight: 400 }}>
            Ixian is not responsible for any third-party content or links
            provided on the Website.
          </span>
        </p>
        <ol start={7}>
          <li>
            <strong> Termination and Suspension of Access</strong>
          </li>
        </ol>
        <p>
          <span style={{ fontWeight: 400 }}>
            Ixian reserves the right to terminate or restrict your access to the
            Website at any time if:
          </span>
        </p>
        <ul>
          <li style={{ fontWeight: 400 }}>
            <span style={{ fontWeight: 400 }}>You violate these Terms.</span>
          </li>
          <li style={{ fontWeight: 400 }}>
            <span style={{ fontWeight: 400 }}>
              There is a legal, regulatory, or security risk associated with
              your use.
            </span>
          </li>
          <li style={{ fontWeight: 400 }}>
            <span style={{ fontWeight: 400 }}>
              Continued access is deemed commercially or socially unacceptable
              by Ixian.
            </span>
          </li>
        </ul>
        <p>
          <span style={{ fontWeight: 400 }}>
            Ixian is not obligated to provide notice prior to termination but
            will attempt to do so when feasible.
          </span>
        </p>
        <ol start={8}>
          <li>
            <strong> Third-Party Websites and Services</strong>
          </li>
        </ol>
        <p>
          <span style={{ fontWeight: 400 }}>
            The Website may contain links to third-party websites. Ixian is not
            responsible for the content, accuracy, or reliability of any
            third-party websites and does not endorse them. Use of third-party
            services is subject to their respective terms and policies.
          </span>
        </p>
        <ol start={9}>
          <li>
            <strong> Governing Law and Jurisdiction</strong>
          </li>
        </ol>
        <p>
          <span style={{ fontWeight: 400 }}>
            These Terms are governed by the laws of{' '}
          </span>
          <strong>Slovenia</strong>
          <span style={{ fontWeight: 400 }}>
            . Any disputes arising from the use of the Website shall be subject
            to the exclusive jurisdiction of the courts in Slovenia. Parties
            agree to attempt resolution through amicable negotiation before
            resorting to litigation.
          </span>
        </p>
        <ol start={10}>
          <li>
            <strong> Changes to the Terms</strong>
          </li>
        </ol>
        <p>
          <span style={{ fontWeight: 400 }}>
            Ixian reserves the right to modify these Terms at any time. Updates
            will be posted on the Website, and continued use after changes
            constitutes acceptance of the revised Terms.
          </span>
        </p>
        <ol start={11}>
          <li>
            <strong> Contact Information</strong>
          </li>
        </ol>
        <p>
          <span style={{ fontWeight: 400 }}>
            For any inquiries regarding these Terms, please contact us at{' '}
          </span>
          <strong>info@ixian.io</strong>
          <span style={{ fontWeight: 400 }}>.</span>
        </p>
      </ContentWrapper>
    </main>
  );
}
