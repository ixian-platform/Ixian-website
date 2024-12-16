import classes from './UseCases.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import Chip from '@components/Chip/Chip';
import TextElement from '@components/TextElement/TextElement';
import Button from '@components/Button/Button';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import { useTranslations } from 'next-intl';
import InteractionCard from '@components/InteractionCard/InteractionCard';
import Icon from '@components/Icon/Icon';
import Link from 'next/link';

const UseCases = () => {
  const t = useTranslations();

  return (
    <ContentWrapper
      wrapperSection
      className={classes.useCases}
      sectionClass={classes.useCasesSection}
    >
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
        ctaContent={
          <Button
            variant={'outlined'}
            leadingIcon={<Icon iconName={'arrow_right_alt'} />}
          >
            {t('lorem')}
          </Button>
        }
      />
      <div className={classes.caseCards}>
        <InteractionCard
          title={t('lorem')}
          description={t('lorem')}
          enableHoverImage
          disableScale
          additionalContent={
            <Link className={classes.useCaseArrowLink} href={'/'}>
              <Icon iconName={'arrow_forward_ios'} variant={'secondary'} />
            </Link>
          }
        />
        <InteractionCard
          title={t('lorem')}
          description={t('lorem')}
          enableHoverImage
          disableScale
          additionalContent={
            <Link className={classes.useCaseArrowLink} href={'/'}>
              <Icon iconName={'arrow_forward_ios'} variant={'secondary'} />
            </Link>
          }
        />
        <InteractionCard
          title={t('lorem')}
          description={t('lorem')}
          enableHoverImage
          disableScale
          additionalContent={
            <Link className={classes.useCaseArrowLink} href={'/'}>
              <Icon iconName={'arrow_forward_ios'} variant={'secondary'} />
            </Link>
          }
        />
        <InteractionCard
          title={t('lorem')}
          description={t('lorem')}
          enableHoverImage
          disableScale
          additionalContent={
            <Link className={classes.useCaseArrowLink} href={'/'}>
              <Icon iconName={'arrow_forward_ios'} variant={'secondary'} />
            </Link>
          }
        />
      </div>
      <SectionHeader
        className={classes.buildTogether}
        title={
          <TextElement type={'display-md'} as={'h1'}>
            {t('lorem')}
          </TextElement>
        }
        subtitle={
          <TextElement type={'body-md'} as={'h1'}>
            {t('lorem')}
          </TextElement>
        }
        ctaContent={
          <Button
            variant={'outlined-2'}
            leadingIcon={<Icon iconName={'orbit'} variant={'secondary'} />}
          >
            {t('lorem')}
          </Button>
        }
      />
    </ContentWrapper>
  );
};

export default UseCases;
