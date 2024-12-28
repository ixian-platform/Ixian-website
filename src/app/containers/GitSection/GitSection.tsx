import classes from './GitSection.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import { useTranslations } from 'next-intl';
import TextElement from '@components/TextElement/TextElement';
import Chip from '@components/Chip/Chip';
import Image from 'next/image';
import bigGithub from '@assets/github-big.svg';
import MyIcon from '@components/MyIcon/MyIcon';
import Milestones from '@components/Milestones/Milestones';

const GitSection = () => {
  const t = useTranslations();

  return (
    <ContentWrapper
      asWrapperSection
      sectionClass={classes.gitSection}
      className={classes.gitSectionWrapper}
    >
      <SectionHeader
        chipContainer={<Chip content={t('lorem')} variant={'outlined'} />}
        title={<TextElement type={'heading-md'}>{t('lorem')}</TextElement>}
        subtitle={<TextElement type={'body-md'}>{t('lorem')}</TextElement>}
        ctaContent={
          <div className={classes.visitGithub}>
            <Image src={bigGithub} alt={'github'} />
            <div className={classes.text}>
              <TextElement type={'heading-sm'}>{t('lorem')}</TextElement>
              <TextElement type={'body-lg'}>{t('lorem')}</TextElement>
            </div>
            <MyIcon name={'arrow_forward_ios'} />
          </div>
        }
      />
      <Milestones />
    </ContentWrapper>
  );
};

export default GitSection;
