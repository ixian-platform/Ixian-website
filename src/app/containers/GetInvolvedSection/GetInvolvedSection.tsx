import classes from './GetInvolvedSection.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import Chip from '@components/Chip/Chip';
import TextElement from '@components/TextElement/TextElement';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import bottomRetro from '@assets/bottom-retro.svg';
import Button from '@components/Button/Button';
import { Section } from '@utils/constants';
import MyIcon from '@components/MyIcon/MyIcon';

const GetInvolvedSection = () => {
  const t = useTranslations();

  return (
    <ContentWrapper
      asWrapperSection
      className={classes.getInvolved}
      sectionClass={classes.getInvolvedSection}
      sectionId={Section.GET_INVOLVED}
    >
      <Image
        priority
        src={bottomRetro}
        alt={'bottom-retro'}
        className={classes.bottomRetro}
      />
      <SectionHeader
        chipContainer={<Chip content={t('lorem')} variant={'outlined'} />}
        title={
          <TextElement type={'heading-lg'} as={'h1'}>
            {t('lorem')}
          </TextElement>
        }
        subtitle={
          <TextElement type={'body-md'} as={'h1'}>
            {t('lorem')}
          </TextElement>
        }
      />
      <div className={classes.involvedCards}>
        <div className={classes.singleCard}>
          <SectionHeader
            className={classes.innerSection}
            chipContainer={
              <div className={classes.headerIcons}>
                <MyIcon name={'ixian_logo'} />
                <MyIcon name={'s2_mark'} />
              </div>
            }
            title={<TextElement type={'heading-sm'}>{t('lorem')}</TextElement>}
            subtitle={<TextElement type={'body-sm'}>{t('lorem')}</TextElement>}
            ctaContent={
              <Button
                leadingIcon={<MyIcon name={'arrow_right_alt'} />}
                variant={'outlined'}
              >
                {t('lorem')}
              </Button>
            }
          />
        </div>
        <div className={classes.singleCard}>
          <SectionHeader
            className={classes.innerSection}
            chipContainer={
              <div className={classes.headerIcons}>
                <MyIcon name={'diversity_2'} rounded />
                <MyIcon name={'wallet'} rounded />
              </div>
            }
            title={<TextElement type={'heading-sm'}>{t('lorem')}</TextElement>}
            subtitle={<TextElement type={'body-sm'}>{t('lorem')}</TextElement>}
            ctaContent={
              <Button
                leadingIcon={<MyIcon name={'arrow_right_alt'} />}
                variant={'outlined'}
              >
                {t('lorem')}
              </Button>
            }
          />
        </div>
      </div>
    </ContentWrapper>
  );
};

export default GetInvolvedSection;
