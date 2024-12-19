import classes from './GetInvolvedSection.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import Chip from '@components/Chip/Chip';
import TextElement from '@components/TextElement/TextElement';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import bottomRetro from '@assets/bottom-retro.svg';
import Button from '@components/Button/Button';
import Icon from '@components/Icon/Icon';
import { Section } from '@utils/constants';

const GetInvolvedSection = () => {
  const t = useTranslations();

  return (
    <ContentWrapper
      wrapperSection
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
                <Icon iconName={'icon'} />
                <Icon iconName={'s2_mark'} variant={'quaternary'} />
              </div>
            }
            title={<TextElement type={'heading-sm'}>{t('lorem')}</TextElement>}
            subtitle={<TextElement type={'body-sm'}>{t('lorem')}</TextElement>}
            ctaContent={
              <Button
                leadingIcon={<Icon iconName={'arrow_right_alt'} />}
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
                <Icon iconName={'diversity_2'} variant={'tertiary'} />
                <Icon iconName={'wallet'} variant={'tertiary'} />
              </div>
            }
            title={<TextElement type={'heading-sm'}>{t('lorem')}</TextElement>}
            subtitle={<TextElement type={'body-sm'}>{t('lorem')}</TextElement>}
            ctaContent={
              <Button
                leadingIcon={<Icon iconName={'arrow_right_alt'} />}
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
