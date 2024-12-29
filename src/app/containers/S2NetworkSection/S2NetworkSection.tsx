import classes from './S2NetworkSection.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';

const highlightsData = [
  {
    icon: 'ixian_logo',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'avg_pace',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'widgets',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'all_match',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'compare_arrows',
    title: 'lorem',
    description: 'lorem',
  },
  {
    icon: 'call_split',
    title: 'lorem',
    description: 'lorem',
  },
];

const S2NetworkSection = () => {
  return (
    <ContentWrapper asWrapperSection sectionClass={classes.s2NetworkSection}>
      test
    </ContentWrapper>
  );
};

export default S2NetworkSection;
