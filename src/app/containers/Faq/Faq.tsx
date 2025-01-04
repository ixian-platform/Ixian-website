'use client';

import classes from './Faq.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import SectionHeader from '@components/SectionHeader/SectionHeader';
import TextElement from '@components/TextElement/TextElement';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import MyIcon from '@components/MyIcon/MyIcon';
import classNames from 'classnames';

const faqData = [
  {
    question: 'What is Ixian?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at libero nec nunc',
  },
  {
    question: 'What is Ixian?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at libero nec nunc',
  },
  {
    question: 'What is Ixian?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at libero nec nunc',
  },
];

const Faq = () => {
  const t = useTranslations();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleQuestionClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <ContentWrapper
      asWrapperSection
      sectionClass={classes.faqSection}
      className={classes.faqWrapper}
    >
      <SectionHeader
        className={classes.header}
        title={<TextElement type={'heading-lg'}>FAQ</TextElement>}
        subtitle={<TextElement type={'body-md'}>{t('lorem')}</TextElement>}
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
                    ? 'keyboard_arrow_up'
                    : 'keyboard_arrow_down'
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
