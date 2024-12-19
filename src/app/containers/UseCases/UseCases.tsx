import classes from './UseCases.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import Chip from '@components/Chip/Chip';
import TextElement from '@components/TextElement/TextElement';
import Button from '@components/Button/Button';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import { useTranslations } from 'next-intl';
import InteractionCard from '@components/InteractionCard/InteractionCard';
import MyIcon from '@components/MyIcon/MyIcon';

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
            leadingIcon={<MyIcon name={'arrow_right_alt'} />}
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
          hoverImageType={'iot'}
          disableScale
          linkHref={'/'}
        />
        <InteractionCard
          title={t('lorem')}
          description={t('lorem')}
          enableHoverImage
          hoverImageType={'enterprise'}
          disableScale
          linkHref={'/'}
        />
        <InteractionCard
          title={t('lorem')}
          description={t('lorem')}
          enableHoverImage
          hoverImageType={'access'}
          disableScale
          linkHref={'/'}
        />
        <InteractionCard
          title={t('lorem')}
          description={t('lorem')}
          enableHoverImage
          hoverImageType={'dapps'}
          disableScale
          linkHref={'/'}
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
            leadingIcon={<MyIcon name={'orbit'} />}
          >
            {t('lorem')}
          </Button>
        }
      />
    </ContentWrapper>
  );
};

export default UseCases;
