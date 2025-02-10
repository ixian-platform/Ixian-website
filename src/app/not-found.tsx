import classes from '@/app/page.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import TextElement from '@components/TextElement/TextElement';
import Button from '@components/Button/Button';
import MyIcon from '@components/MyIcon/MyIcon';

export default async function NotFound() {
  return (
    <section className={classes.page}>
      <ContentWrapper
        asWrapperSection
        sectionClass={classes.notFoundSection}
        className={classes.notFound}
      >
        <SectionHeader
          title={<TextElement type={'display-lg'}>Page Not Found</TextElement>}
          subtitle={
            <TextElement type={'body-md'}>
              The page you are looking for doesnt exist
            </TextElement>
          }
          ctaContent={
            <Button
              leadingIcon={<MyIcon name={'WestRounded'} />}
              variant={'outlined'}
            >
              Back to Home
            </Button>
          }
        />
      </ContentWrapper>
    </section>
  );
}
