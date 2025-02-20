import classes from './GetInvolvedSection.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import Chip from '@components/Chip/Chip';
import TextElement from '@components/TextElement/TextElement';
import { useTranslations } from 'next-intl';
import Button from '@components/Button/Button';
import { Routes, Section } from '@utils/constants';
import MyIcon from '@components/MyIcon/MyIcon';

const GetInvolvedSection = () => {
  const t = useTranslations('GetInvolved');

  return (
    <ContentWrapper
      asWrapperSection
      className={classes.getInvolved}
      sectionClass={classes.getInvolvedSection}
      sectionId={Section.GET_INVOLVED}
    >
      <SectionHeader
        chipContainer={<Chip content={t('chip')} variant={'outlined'} />}
        title={
          <TextElement type={'heading-lg'} as={'h1'}>
            {t('title')}
          </TextElement>
        }
        subtitle={
          <TextElement type={'body-md'} as={'h1'}>
            {t('subtitle')}
          </TextElement>
        }
      />
      <div className={classes.involvedCards}>
        <div className={classes.singleCard}>
          <SectionHeader
            className={classes.innerSection}
            chipContainer={
              <div className={classes.headerIcons}>
                <MyIcon customName={'ixian_logo'} />
                <MyIcon customName={'s2_mark'} />
              </div>
            }
            title={<TextElement type={'heading-sm'}>{t('earn')}</TextElement>}
            subtitle={
              <TextElement type={'body-sm'}>{t('earnDesc')}</TextElement>
            }
            ctaContent={
              <Button
                href={`${Routes.TECHNOLOGY}#${Section.IXIAN_DLT}`}
                leadingIcon={<MyIcon name={'EastRounded'} />}
                variant={'outlined'}
              >
                {t('runYourNode')}
              </Button>
            }
          />
        </div>
        <div className={classes.singleCard}>
          <SectionHeader
            className={classes.innerSection}
            title={
              <TextElement type={'heading-sm'}>
                {t('joinCommunityTitle')}
              </TextElement>
            }
            subtitle={
              <TextElement type={'body-sm'}>
                {t('joinCommunityDesc')}
              </TextElement>
            }
            ctaContent={
              <Button
                href={Routes.GET_INVOLVED}
                leadingIcon={<MyIcon name={'EastRounded'} />}
                variant={'outlined'}
              >
                {t('joinCommunity')}
              </Button>
            }
          />
        </div>
      </div>
    </ContentWrapper>
  );
};

export default GetInvolvedSection;
