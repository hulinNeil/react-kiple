import React from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';
import { HistoryStatusEnum, TemplateKindEnum } from '@/config/smsMail';

export const renderColTime = (time: number) => <span>{moment(time).format('YYYY-MM-DD HH:mm:ss')}</span>;

export const renderColStatus = (status: number) => <span>{intl.get(HistoryStatusEnum[status])}</span>;

export const renderColCount = (to: string) => <span>{to.split(',').length - 1}</span>;

export const renderColKind = (kind: number) => <span>{intl.get(TemplateKindEnum[kind])}</span>;
