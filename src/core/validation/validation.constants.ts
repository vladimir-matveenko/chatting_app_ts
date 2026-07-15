export const ValidationConstants = {
  User: {
    UserName: {
      MinLength: 3,
      MaxLength: 30,
      Regex: /^[a-zA-Z0-9_]+$/,
    },

    Password: {
      MinLength: 8,
      MaxLength: 255,
    },
  },

  Chat: {
    Name: {
      MinLength: 1,
      MaxLength: 100,
    },
  },

  Message: {
    Text: {
      MaxLength: 4000,
    },
  },
} as const;
