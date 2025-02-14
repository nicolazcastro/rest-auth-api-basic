export enum Weather{
  Sunny = 'sunny',
  Rainy = 'rainy',
  Cloudy = 'cloudy',
  Windy = 'windy',
  Stormy = 'stormy'
}

export enum Visibility{
  Great = 'great',
  Good = 'good',
  Ok = 'ok',
  Poor = 'poor'
}

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
  'addDiary',
  'updateDiary',
  'deleteDiary',
  'getUsers'
}
