import React from 'react';
import classes from './LoadingSpinner.module.scss';

const LoadingSpinner = () => {
  return (
    <section className={classes.loadingSection}>
      <div className={classes.loadingSpinner} />
    </section>
  );
};

export default LoadingSpinner;
