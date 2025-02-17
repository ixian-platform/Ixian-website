import classes from '@/app/page.module.scss';
import EcoGetInvolved from '@/app/containers/EcoGetInvolved/EcoGetInvolved';
import PoweringIxian from '@/app/containers/PoweringIxian/PoweringIxian';
import Contribute from '@/app/containers/Contribute/Contribute';
import {generateSEO} from "@utils/seo";

export async function generateMetadata() {
    return generateSEO({
        title: 'Join the Ixian Ecosystem | Shape the Future of Decentralization',
        description:
            'Become part of the Ixian community, and help drive the future of decentralized technology.',
    });
}

export default function EcosystemGetInvolved() {
  return (
    <section className={classes.page}>
      <EcoGetInvolved />
      <PoweringIxian />
      <Contribute />
    </section>
  );
}
