import React from 'react';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import MyIcon from '@components/MyIcon/MyIcon';
import TextElement from '@components/TextElement/TextElement';
import Link from 'next/link';
import { ixianGitHub } from '@utils/constants';
import Button from '@components/Button/Button';
import { useTranslations } from 'next-intl';
import classes from './OpenSourceCard.module.scss';

const OpenSourceCard = () => {
  const t = useTranslations('LandingFeatures');

  return (
    <ContentWrapper
      asWrapperSection
      className={classes.openSourceCard}
      sectionClass={classes.openSourceCardSection}
    >
      <div className={classes.openSourceCard}>
        <div className={classes.leftSide}>
          <MyIcon name={'GitHub'} width={64} height={64} />
          <div className={classes.text}>
            <TextElement type={'heading-sm'}>
              {t('openSourceCard.title')}
            </TextElement>
            <TextElement type={'body-sm'}>
              {t('openSourceCard.subtitle')}
            </TextElement>
          </div>
        </div>
        <Link passHref href={ixianGitHub} target={'_blank'}>
          <Button
            variant={'outlined'}
            leadingIcon={<MyIcon name={'EastRounded'} />}
          >
            {t('openSourceCard.cta')}
          </Button>
        </Link>
      </div>
    </ContentWrapper>
  );
};

export default OpenSourceCard;
