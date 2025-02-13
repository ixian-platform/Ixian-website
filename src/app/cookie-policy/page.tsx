import TextElement from '@components/TextElement/TextElement';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import classes from '../privacy-policy/legal.module.scss';

export default function Cookies() {
  return (
    <main className={classes.privacyPolicy}>
      <ContentWrapper
        className={classes.wrapper}
        asWrapperSection
        sectionClass={classes.wrapperSection}
      >
        <div className={classes.title}>
          <TextElement type={'heading-lg'} as={'h1'}>
            Cookie Policy
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
            This Cookie Policy explains how Ixian Foundation ("Ixian," "we,"
            "our," or "us") uses cookies and similar tracking technologies when
            you visit our website ("Website"). It describes what cookies are,
            how we use them, and how you can manage your preferences.
          </span>
        </p>
        <p>
          <span>
            By using our Website, you agree to the use of cookies as outlined in
            this policy. If you do not agree, you can adjust your browser
            settings or discontinue use of the Website.
          </span>
        </p>
        <ol start={2}>
          <li>
            <strong> What Are Cookies?</strong>
          </li>
        </ol>
        <p>
          <span>
            Cookies are small text files stored on your device (computer,
            smartphone, or tablet) when you visit a website. They help websites
            recognize returning users, store preferences, and enhance user
            experience. Some cookies are essential for the Website to function
            correctly, while others help us analyze traffic and improve
            performance.
          </span>
        </p>
        <ol start={3}>
          <li>
            <strong> Types of Cookies We Use</strong>
          </li>
        </ol>
        <p>
          <span>We use the following types of cookies on our Website:</span>
        </p>
        <ul>
          <li>
            <strong>Essential Cookies</strong>
            <span>
              : Necessary for the Website’s functionality (e.g., session
              management, security). Without these, certain services cannot be
              provided.
            </span>
          </li>
          <li>
            <strong>Session Cookies</strong>
            <span>
              : Temporary cookies that are deleted from your computer when you
              close your browser.
            </span>
          </li>
          <li>
            <strong>Persistent Cookies</strong>
            <span>
              : Stored on your device for a defined period or until manually
              deleted. These help remember user preferences for future visits.
            </span>
          </li>
          <li>
            <strong>Analytics Cookies</strong>
            <span>
              : Help us understand how visitors interact with our Website by
              collecting anonymous information (e.g., Google Analytics).
            </span>
          </li>
          <li>
            <strong>Functionality Cookies</strong>
            <span>
              : Store user preferences, such as language settings, to enhance
              user experience.
            </span>
          </li>
          <li>
            <strong>Third-Party Cookies</strong>
            <span>
              : Set by external services integrated into our Website, such as
              social media sharing tools or embedded content (e.g., YouTube,
              Twitter, LinkedIn).
            </span>
          </li>
        </ul>
        <ol start={4}>
          <li>
            <strong> How We Use Cookies</strong>
          </li>
        </ol>
        <p>
          <span>We use cookies to:</span>
        </p>
        <ul>
          <li>
            <span>Ensure the Website operates correctly.</span>
          </li>
          <li>
            <span>Improve Website security.</span>
          </li>
          <li>
            <span>Analyze visitor behavior to enhance user experience.</span>
          </li>
          <li>
            <span>Remember your settings and preferences.</span>
          </li>
          <li>
            <span>Provide relevant content and services.</span>
          </li>
          <li>
            <span>Manage account signup and authentication processes.</span>
          </li>
          <li>
            <span>
              Store newsletter subscription status and notification preferences.
            </span>
          </li>
        </ul>
        <ol start={5}>
          <li>
            <strong> Managing Cookies</strong>
          </li>
        </ol>
        <p>
          <span>
            You can control and manage cookies through your browser settings.
            Most browsers allow you to:
          </span>
        </p>
        <ul>
          <li>
            <span>Block cookies from specific websites.</span>
          </li>
          <li>
            <span>Delete stored cookies.</span>
          </li>
          <li>
            <span>Disable cookies entirely.</span>
          </li>
        </ul>
        <p>
          <span>
            Please note that restricting cookies may impact the functionality of
            our Website, including account login, newsletter subscriptions, and
            personalized settings.
          </span>
        </p>
        <p>
          <span>To manage cookies, refer to your browser’s support pages:</span>
        </p>
        <ul>
          <li>
            <span>Google Chrome:</span>
            <a href="https://support.google.com/chrome/answer/95647?hl=en">
              {' '}
              <span>Manage Cookies</span>
            </a>
          </li>
          <li>
            <span>Mozilla Firefox:</span>
            <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop">
              {' '}
              <span>Manage Cookies</span>
            </a>
          </li>
          <li>
            <span>Microsoft Edge:</span>
            <a href="https://support.microsoft.com/en-us/microsoft-edge/view-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09">
              {' '}
              <span>Manage Cookies</span>
            </a>
          </li>
          <li>
            <span>Safari:</span>
            <a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac">
              {' '}
              <span>Manage Cookies</span>
            </a>
          </li>
        </ul>
        <ol start={6}>
          <li>
            <strong> Third-Party Cookies</strong>
          </li>
        </ol>
        <p>
          <span>
            Our Website may contain cookies from third-party services,
            including:
          </span>
        </p>
        <ul>
          <li>
            <strong>Google Analytics</strong>
            <span>
              {' '}
              (to track website traffic and usage patterns; Google stores and
              processes this data as outlined in their
            </span>
            <a href="http://www.google.com/privacypolicy.html">
              {' '}
              <span>Privacy Policy</span>
            </a>
            <span>).</span>
          </li>
          <li>
            <strong>Social media platforms</strong>
            <span>
              {' '}
              (LinkedIn, Twitter, Facebook) for sharing content and interacting
              with social networks.t.
            </span>
          </li>
          <li>
            <strong>Third-party tracking services</strong>
            <span>
              {' '}
              for usage analysis and personalized content recommendations.
            </span>
          </li>
        </ul>
        <p>
          <span>
            These third parties have their own cookie policies, which we
            recommend reviewing.
          </span>
        </p>
        <ol start={7}>
          <li>
            <strong> Changes to This Cookie Policy</strong>
          </li>
        </ol>
        <p>
          <span>
            We may update this Cookie Policy to reflect changes in our use of
            cookies. Updates will be posted on this page, and continued use of
            the Website constitutes acceptance of the revised policy.
          </span>
        </p>
        <ol start={8}>
          <li>
            <strong> Contact Us</strong>
          </li>
        </ol>
        <p>
          <span>
            If you have questions about this Cookie Policy, please contact us at{' '}
          </span>
          <strong>info@ixian.io</strong>
          <span>.</span>
        </p>
      </ContentWrapper>
    </main>
  );
}
