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
            <TextElement type={'label-md'}>
              The connectivity platform.
            </TextElement>
            <div>socials...</div>
            <div className={classes.divider} />
            <div className={classes.info}>
              <TextElement type={'label-sm'}>
                Proudly endorsed by IXI Labs.
              </TextElement>
              <div className={classes.address}>
                <TextElement type={'body-sm'}>
                  {t('address.slo.street')}
                </TextElement>
                <TextElement type={'body-sm'}>
                  {t('address.slo.city')}
                </TextElement>
                <TextElement type={'body-sm'}>
                  {t('address.slo.country')}
                </TextElement>
              </div>
              <div className={classes.address}>
                <TextElement type={'body-sm'}>
                  {t('address.eng.street')}
                </TextElement>
                <TextElement type={'body-sm'}>
                  {t('address.eng.city')}
                </TextElement>
                <TextElement type={'body-sm'}>
                  {t('address.eng.country')}
                </TextElement>
              </div>
            </div>
          </div>
          <div className={classes.rightContent}>
            <div className={classes.singleColumn}>
              <TextElement type={'label-sm'} className={classes.mainTitle}>
                Resources
              </TextElement>
              {technologySubmenu.map((item) => (
                <Link href={item.href} key={item.title}>
                  <TextElement type={'body-sm'}>{item.title}</TextElement>
                </Link>
              ))}
            </div>
            <div className={classes.singleColumn}>
              <TextElement type={'label-sm'} className={classes.mainTitle}>
                Resources
              </TextElement>
              {technologySubmenu.map((item) => (
                <Link href={item.href} key={item.title}>
                  <TextElement type={'body-sm'}>{item.title}</TextElement>
                </Link>
              ))}
            </div>
            <div className={classes.singleColumn}>
              <TextElement type={'label-sm'} className={classes.mainTitle}>
                Resources
              </TextElement>
              {technologySubmenu.map((item) => (
                <Link href={item.href} key={item.title}>
                  <TextElement type={'body-sm'}>{item.title}</TextElement>
                </Link>
              ))}
            </div>
            <div className={classes.singleColumn}>
              <TextElement type={'label-sm'} className={classes.mainTitle}>
                Resources
              </TextElement>
              {technologySubmenu.map((item) => (
                <Link href={item.href} key={item.title}>
                  <TextElement type={'body-sm'}>{item.title}</TextElement>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className={classes.divider} />
        <div className={classes.copyright}>
          <TextElement type={'label-sm'}>
            &#169; Ixian Foundation, 2017 - {new Date()?.getFullYear()}
          </TextElement>
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
