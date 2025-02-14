import { Schema } from 'mongoose'
export = [
  {
    date: '2017-05-11',
    weather: 'rainy',
    visibility: 'poor',
    comment: 'I almost failed the landing but I survived',
    userId: 1,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'IUser'
    }
  },
  {
    date: '2015-11-01',
    weather: 'cloudy',
    visibility: 'good',
    comment: 'Pretty scary flight',
    userId: 2,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'IUser'
    }
  },
  {
    date: '2017-04-01',
    weather: 'sunny',
    visibility: 'good',
    comment: 'Everything went better than expected, I`m learning much.',
    userId: 3,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'IUser'
    }
  },
  {
    date: '2011-14-15',
    weather: 'windy',
    visibility: 'good',
    comment: 'I`m getting pretty. I`m glad I`m alive',
    userId: 1,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'IUser'
    }
  },
  {
    date: '2017-05-11',
    weather: 'cloudy',
    visibility: 'good',
    comment: 'I almost failed the landing but I survived',
    userId: 2,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'IUser'
    }
  },
  {
    date: '2017-01-01',
    weather: 'rainy',
    visibility: 'poor',
    comment: 'Pretty scary flight, I`m glad I`m alive',
    userId: 3,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'IUser'
    }
  },
  {
    date: '2017-04-01',
    weather: 'sunny',
    visibility: 'good',
    comment: 'Everything went better than expected, I`m learning much',
    userId: 1,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'IUser'
    }
  },
  {
    date: '2017-04-15',
    weather: 'windy',
    visibility: 'good',
    comment: 'I`m getting pretty confident although I hit a flock of birds',
    userId: 1,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'IUser'
    }
  }
]
