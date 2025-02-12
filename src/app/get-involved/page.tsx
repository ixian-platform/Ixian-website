import classes from '@/app/page.module.scss';
import EcoGetInvolved from '@/app/containers/EcoGetInvolved/EcoGetInvolved';
import PoweringIxian from '@/app/containers/PoweringIxian/PoweringIxian';
import Contribute from '@/app/containers/Contribute/Contribute';

export default function EcosystemGetInvolved() {
  return (
    <section className={classes.page}>
      <EcoGetInvolved />
      <PoweringIxian />
      <Contribute />
    </section>
  );
}
