export enum Profile{
  Admin = 'admin',
  User = 'user'
}

export enum AccessTypes{
  'getEntries',
  'findByIdWithoutSensitiveInfo',
  'findById',
  'me'
}

export enum AdminAccessTypes{
  'getEntries',
  'findByIdWithoutSensitiveInfo',
  'findById',
  'me',
  'getUsers'
}
