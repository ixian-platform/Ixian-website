'use client';

import React, { useEffect, useState } from 'react';
import TextElement from '@components/TextElement/TextElement';

const Copyright = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear()); // Ensures it updates on the client
  }, []);

  return (
    <TextElement type={'label-sm'}>&#169; Ixian, 2017 - {year}</TextElement>
  );
};

export default Copyright;
