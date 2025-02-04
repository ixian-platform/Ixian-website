'use client';

import classes from './Faq.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import TextElement from '@components/TextElement/TextElement';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import MyIcon from '@components/MyIcon/MyIcon';
import classNames from 'classnames';

const Faq = () => {
  const t = useTranslations('BuildPage.faq');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleQuestionClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: t('q1'),
      answer: t('a1'),
    },
    {
      question: t('q2'),
      answer: t('a2'),
    },
    {
      question: t('q3'),
      answer: t('a3'),
    },
  ];

  return (
    <ContentWrapper
      asWrapperSection
      sectionClass={classes.faqSection}
      className={classes.faqWrapper}
    >
      <SectionHeader
        className={classes.header}
        title={<TextElement type={'heading-lg'}>{t('title')}</TextElement>}
        subtitle={<TextElement type={'body-md'}>{t('subtitle')}</TextElement>}
      />
      <div className={classes.questions}>
        {faqData.map((faq, index) => (
          <div key={index} className={classes.questionItem}>
            <div
              className={classes.question}
              onClick={() => handleQuestionClick(index)}
            >
              <MyIcon
                name={
                  openIndex === index
                    ? 'ExpandLessRounded'
                    : 'ExpandMoreRounded'
                }
              />
              <TextElement type={'label-lg'}>{faq.question}</TextElement>
            </div>
            <div
              className={classNames(classes.answer, {
                [classes.open]: openIndex === index,
              })}
            >
              <TextElement type={'body-md'}>{faq.answer}</TextElement>
            </div>
          </div>
        ))}
      </div>
    </ContentWrapper>
  );
};

export default Faq;
