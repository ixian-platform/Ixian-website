import classes from './GitSection.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import { useTranslations } from 'next-intl';
import TextElement from '@components/TextElement/TextElement';
import Chip from '@components/Chip/Chip';
import MyIcon from '@components/MyIcon/MyIcon';
import Milestones from '@components/Milestones/Milestones';
import Link from 'next/link';
import { ixianGitHub } from '@utils/constants';

const GitSection = () => {
  const t = useTranslations('TechnologyPage.gitSection');

  return (
    <ContentWrapper
      asWrapperSection
      sectionClass={classes.gitSection}
      className={classes.gitSectionWrapper}
    >
      <SectionHeader
        inverseText
        chipContainer={
          <Chip content={t('chip')} variant={'outlined'} isTextInversed />
        }
        title={<TextElement type={'heading-md'}>{t('title')}</TextElement>}
        subtitle={<TextElement type={'body-md'}>{t('subtitle')}</TextElement>}
        ctaContent={
          <Link
            href={ixianGitHub}
            target={'_blank'}
            className={classes.visitGithub}
          >
            <div className={classes.left}>
              <MyIcon name={'GitHub'} width={64} height={64} />
              <TextElement type={'heading-sm'}>{t('visitIxian')}</TextElement>
            </div>
            <MyIcon name={'ArrowForwardIosRounded'} />
          </Link>
        }
      />
      <div className={classes.gitDivider} />
      <Milestones />
    </ContentWrapper>
  );
};

export default GitSection;
