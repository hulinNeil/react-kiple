export enum TemplateKindEnum {
  all = 0,
  'sms.kind.marketing' = 1,
  'sms.kind.warning' = 2,
  'sms.kind.verification' = 3,
}

export enum HistoryStatusEnum {
  all = 0,
  'sms.status.pending' = 1,
  'sms.status.success' = 2,
  'sms.status.fail' = 3,
}

export enum CronJobStatusEnum {
  all = 0,
  'sms.status.pending' = 1,
  'sms.status.sending' = 2,
  'sms.status.sent' = 3,
}
