import classes from './Footer.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import Link from 'next/link';
import { Routes } from '@utils/constants';
import TextElement from '@components/TextElement/TextElement';
import { technologySubmenu } from '@utils/menuUtils';
import Image from 'next/image';
import ixianLogo from '@assets/ixian-logo.svg';
import React from 'react';
import { useTranslations } from 'next-intl';
import MyIcon from '@components/MyIcon/MyIcon';
import { socials } from '@utils/socialsUtil';
import Copyright from '@components/Copyright/Copyright';

const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <footer className={classes.footer}>
      <ContentWrapper className={classes.wrapper}>
        <div className={classes.header}>
          <div className={classes.leftContent}>
            <Image
              priority
              src={ixianLogo}
              alt={'ixian-logo'}
              width={100}
              height={32}
            />
            <TextElement type={'label-md'}>{t('label')}</TextElement>
            <div className={classes.socialsContainer}>
              {socials?.map((social) => (
                <Link href={social.href} key={social.alt} target={'_blank'}>
                  <Image
                    src={social.img}
                    alt={social.alt}
                    width={24}
                    height={24}
                  />
                </Link>
              ))}
            </div>
            <div className={classes.divider} />
            <TextElement type={'label-sm'}>{t('endorsed')}</TextElement>
          </div>
          <div className={classes.rightContent}>
            <div className={classes.singleColumn}>
              <TextElement type={'label-sm'} className={classes.mainTitle}>
                Resources
              </TextElement>
              {technologySubmenu.map((item) => (
                <Link href={item.href} key={item.title}>
                  <TextElement type={'label-sm'}>{item.title}</TextElement>
                </Link>
              ))}
            </div>
            <div className={classes.singleColumn}>
              <TextElement type={'label-sm'} className={classes.mainTitle}>
                Resources
              </TextElement>
              {technologySubmenu.map((item) => (
                <Link href={item.href} key={item.title}>
                  <TextElement type={'label-sm'}>{item.title}</TextElement>
                </Link>
              ))}
            </div>
            <div className={classes.singleColumn}>
              <TextElement type={'label-sm'} className={classes.mainTitle}>
                Resources
              </TextElement>
              {technologySubmenu.map((item) => (
                <Link href={item.href} key={item.title}>
                  <TextElement type={'label-sm'}>{item.title}</TextElement>
                </Link>
              ))}
            </div>
            <div className={classes.singleColumn}>
              <TextElement type={'label-sm'} className={classes.mainTitle}>
                {t('external.title')}
              </TextElement>
              <Link
                href={'/'}
                target={'_blank'}
                className={classes.externalLink}
              >
                <TextElement type={'label-sm'}>
                  {t('external.ixiLabs')}
                </TextElement>
                <MyIcon name={'Launch'} height={12} width={12} />
              </Link>
              <Link
                href={'/'}
                target={'_blank'}
                className={classes.externalLink}
              >
                <TextElement type={'label-sm'}>
                  {t('external.spixi')}
                </TextElement>
                <MyIcon name={'Launch'} height={12} width={12} />
              </Link>
              <Link
                href={'/'}
                target={'_blank'}
                className={classes.externalLink}
              >
                <TextElement type={'label-sm'}>
                  {t('external.IXInames')}
                </TextElement>
                <MyIcon name={'Launch'} height={12} width={12} />
              </Link>
              <Link
                href={'/'}
                target={'_blank'}
                className={classes.externalLink}
              >
                <TextElement type={'label-sm'}>
                  {t('external.mineIXI')}
                </TextElement>
                <MyIcon name={'Launch'} height={12} width={12} />
              </Link>
              <Link
                href={'/'}
                target={'_blank'}
                className={classes.externalLink}
              >
                <TextElement type={'label-sm'}>
                  {t('external.github')}
                </TextElement>
                <MyIcon name={'Launch'} height={12} width={12} />
              </Link>
            </div>
          </div>
        </div>
        <div className={classes.divider} />
        <div className={classes.copyright}>
          <Copyright />
          <div className={classes.legalItems}>
            <Link href={Routes.PP}>
              <TextElement type={'label-sm'}>Terms of Use</TextElement>
            </Link>
            <Link href={Routes.PP}>
              <TextElement type={'label-sm'}>Privacy Policy</TextElement>
            </Link>
            <Link href={Routes.PP}>
              <TextElement type={'label-sm'}>Cookies</TextElement>
            </Link>{' '}
            <Link href={Routes.PP}>
              <TextElement type={'label-sm'}>MIT License</TextElement>
            </Link>
          </div>
        </div>
      </ContentWrapper>
    </footer>
  );
};

export default Footer;
