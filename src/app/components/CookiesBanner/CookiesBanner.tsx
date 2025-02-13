'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import TextElement from '@components/TextElement/TextElement';
import Button from '@components/Button/Button';
import classes from './CookiesBanner.module.scss';
import Link from 'next/link';
import { Routes } from '@utils/constants';

const CookiesBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!Cookies.get('cookiesAccepted')) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set('cookiesAccepted', 'true', { expires: 365 });
    setShow(false);
  };

  if (!show) return null;

  return (
    <section className={classes.cookiesBanner}>
      <TextElement type={'label-lg'}>
        This website uses cookies to enhance the user experience.
      </TextElement>
      <Link href={Routes.COOKIES} className={classes.link}>
        <TextElement type={'body-md'}>Learn about cookie policy</TextElement>
      </Link>
      <div className={classes.buttons}>
        <Button onClick={handleAccept}>Accept</Button>
        <Button variant={'outlined'} onClick={() => setShow(false)}>
          Decline
        </Button>
      </div>
    </section>
  );
};

export default CookiesBanner;
