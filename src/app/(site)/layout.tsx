import '@site/styles/tokens.css';
import '@site/styles/base.css';
import Nav from '@site/components/Nav';
import Footer from '@site/components/Footer';
import MotionProvider from '@site/components/MotionProvider';
import Consent from '@site/components/Consent';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ix">
      <a href="#main" className="ix-skip">
        Skip to content
      </a>
      <MotionProvider />
      <Nav />
      <main id="main">{children}</main>
      <Footer />
      <Consent />
    </div>
  );
}
