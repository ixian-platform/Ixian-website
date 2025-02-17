import classes from './Footer.module.scss';
import ContentWrapper from '@components/ContentWrapper/ContentWrapper';
import Link from 'next/link';
import {
  ixianGitHub,
  ixiLabs,
  mineIxiLink,
  Routes,
  spixiWebsite,
} from '@utils/constants';
import TextElement from '@components/TextElement/TextElement';
import { getInvolvedMenu, learnMenu, resourcesMenu } from '@utils/menuUtils';
import Image from 'next/image';
import ixianLogo from '@assets/ixian-logo.svg';
import React from 'react';
import { useTranslations } from 'next-intl';
import { socials } from '@utils/socialsUtil';
import Copyright from '@components/Copyright/Copyright';
import MyIcon from '@components/MyIcon/MyIcon';

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
                {t('learn')}
              </TextElement>
              {learnMenu.map((item) => (
                <Link
                  href={item.href}
                  key={item.title}
                  target={item.isExternal ? '_blank' : ''}
                >
                  <TextElement type={'label-sm'}>{item.title}</TextElement>
                </Link>
              ))}
            </div>
            <div className={classes.singleColumn}>
              <TextElement type={'label-sm'} className={classes.mainTitle}>
                {t('resources')}
              </TextElement>
              {resourcesMenu.map((item) => (
                <Link
                  href={item.href}
                  key={item.title}
                  target={item.isExternal ? '_blank' : ''}
                >
                  <TextElement type={'label-sm'}>{item.title}</TextElement>
                </Link>
              ))}
            </div>
            <div className={classes.singleColumn}>
              <TextElement type={'label-sm'} className={classes.mainTitle}>
                {t('getInvolved')}
              </TextElement>
              {getInvolvedMenu.map((item) => (
                <Link
                  href={item.href}
                  key={item.title}
                  target={item.isExternal ? '_blank' : ''}
                >
                  <TextElement type={'label-sm'}>{item.title}</TextElement>
                </Link>
              ))}
            </div>
            <div className={classes.singleColumn}>
              <TextElement type={'label-sm'} className={classes.mainTitle}>
                {t('external.title')}
              </TextElement>
              <Link
                href={ixiLabs}
                target={'_blank'}
                className={classes.externalLink}
              >
                <TextElement type={'label-sm'}>
                  {t('external.ixiLabs')}
                </TextElement>
                <MyIcon name={'NorthEastRounded'} />
              </Link>
              <Link
                href={spixiWebsite}
                target={'_blank'}
                className={classes.externalLink}
              >
                <TextElement type={'label-sm'}>
                  {t('external.spixi')}
                </TextElement>
                <MyIcon name={'NorthEastRounded'} />
              </Link>
              {/*<Link*/}
              {/*  href={'/'}*/}
              {/*  target={'_blank'}*/}
              {/*  className={classes.externalLink}*/}
              {/*>*/}
              {/*  <TextElement type={'label-sm'}>*/}
              {/*    {t('external.IXInames')}*/}
              {/*  </TextElement>*/}
              {/*</Link>*/}
              <Link
                href={mineIxiLink}
                target={'_blank'}
                className={classes.externalLink}
              >
                <TextElement type={'label-sm'}>
                  {t('external.mineIXI')}
                </TextElement>
                <MyIcon name={'NorthEastRounded'} />
              </Link>
              <Link
                href={ixianGitHub}
                target={'_blank'}
                className={classes.externalLink}
              >
                <TextElement type={'label-sm'}>
                  {t('external.github')}
                </TextElement>
                <MyIcon name={'NorthEastRounded'} />
              </Link>
            </div>
          </div>
        </div>
        <div className={classes.divider} />
        <div className={classes.copyright}>
          <Copyright />
          <div className={classes.legalItems}>
            <Link href={Routes.TERMS}>
              <TextElement type={'label-sm'}>Terms of Use</TextElement>
            </Link>
            <Link href={Routes.PP}>
              <TextElement type={'label-sm'}>Privacy Policy</TextElement>
            </Link>
            <Link href={Routes.COOKIES}>
              <TextElement type={'label-sm'}>Cookie Policy</TextElement>
            </Link>
          </div>
        </div>
      </ContentWrapper>
    </footer>
  );
};

export default Footer;
