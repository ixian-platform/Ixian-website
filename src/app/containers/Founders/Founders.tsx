import React from 'react';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import classes from './Founders.module.scss';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import TextElement from '@components/TextElement/TextElement';
import Chip from '@components/Chip/Chip';
import { useTranslations } from 'next-intl';
import MyIcon from '@components/MyIcon/MyIcon';
import InteractionCard from '@components/InteractionCard/InteractionCard';
import classNames from 'classnames';

const Founders = () => {
  const t = useTranslations('AboutUsPage.founders');

  return (
    <ContentWrapper
      asWrapperSection
      className={classes.founders}
      sectionClass={classes.foundersSection}
    >
      <div className={classes.foundersCardContainer}>
        <SectionHeader
          centerAll
          inverseText
          chipContainer={
            <Chip isTextInversed content={t('chip')} variant={'outlined'} />
          }
          title={<TextElement type={'heading-md'}>{t('title')}</TextElement>}
          subtitle={<TextElement type={'body-md'}>{t('subtitle')}</TextElement>}
        />
        <div className={classes.cardsContainer}>
          <InteractionCard
            href={t('markoLinkedin')}
            isExternal
            icon={<MyIcon name={'LinkedIn'} width={40} height={40} />}
            title={t('marko')}
            className={classNames(classes.card)}
            titleClassName={classes.cardTitle}
          />
          <InteractionCard
            href={t('chrisLinkedin')}
            isExternal
            icon={<MyIcon name={'LinkedIn'} width={40} height={40} />}
            title={t('chris')}
            className={classNames(classes.card, classes.chris)}
            titleClassName={classes.cardTitle}
          />
          <InteractionCard
            href={t('damirLinkedin')}
            isExternal
            icon={<MyIcon name={'LinkedIn'} width={40} height={40} />}
            title={t('damir')}
            className={classNames(classes.card, classes.damir)}
            titleClassName={classes.cardTitle}
          />
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Founders;
