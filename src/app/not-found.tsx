import classes from '@/app/page.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import TextElement from '@components/TextElement/TextElement';
import Button from '@components/Button/Button';
import MyIcon from '@components/MyIcon/MyIcon';
import { getServerTranslations } from '@utils/getServerTranslations';
import { Routes } from '@utils/constants';

const t = await getServerTranslations();

export default async function NotFound() {
  return (
    <section className={classes.page}>
      <ContentWrapper
        asWrapperSection
        sectionClass={classes.notFoundSection}
        className={classes.notFound}
      >
        <div className={classes.notFoundInnerCard}>
          <SectionHeader
            chipContainer={
              <TextElement type={'display-lg'}>
                {t('NotFound.code')}
              </TextElement>
            }
            title={
              <TextElement type={'heading-lg'}>
                {t('NotFound.title')}
              </TextElement>
            }
            subtitle={
              <TextElement type={'body-lg'}>
                {t('NotFound.subtitle')}
              </TextElement>
            }
            ctaContent={
              <Button
                href={Routes.INDEX}
                leadingIcon={<MyIcon name={'EastRounded'} />}
              >
                {t('NotFound.cta')}
              </Button>
            }
          />
        </div>
      </ContentWrapper>
    </section>
  );
}
