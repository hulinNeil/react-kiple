import React from 'react';
import { Col, Row } from 'antd';
import Line from './Line';
import Page from '@/components/Page';

const Bar = () => (
  <Page title="概述">
    <Row gutter={20}>
      <Col md={8}>
        <Line />
      </Col>
      <Col md={8}>
        <Line />
      </Col>
      <Col md={8}>
        <Line />
      </Col>
    </Row>
  </Page>
);

export default Bar;
