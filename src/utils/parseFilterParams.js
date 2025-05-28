const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return null;
  const isType = (type) => ['work', 'home', 'personal'].includes(type);

  if (isType(type)) return type;
};

const parseBoolean = (value) => {
  const isString = typeof value === 'string';
  if (!isString) return null;

  switch (value) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return null;
  }
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseBoolean(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
