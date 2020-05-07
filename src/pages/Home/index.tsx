import React from 'react';
import intl from 'react-intl-universal';
import './index.less';

const Home: React.FC<{}> = () => {
  return <div className="home">{intl.get('index')}</div>;
};

export default Home;
