/*
  Parses an identifier to find if it's a Guid or Int or Custom identifier
  If Guid or Int, the object will return a suggested REST query for the identifier */
export const getIdentifierType = (identifier) => {
  const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const intRegex = /\D/g;
  const stringId = identifier.toString();

  if (stringId.match(guidRegex)) {
    return {
      type: 'guid',
      value: identifier,
      query: `Guid eq (guid'${identifier}')`,
    };
  }
  if (!stringId.match(intRegex)) {
    return { type: 'int', value: identifier, query: `Id eq ${identifier}` };
  }

  return { type: 'custom', value: identifier, query: null };
};

export const isRequired = (method, param) => {
  throw new Error(`${method} : ${param} is required`);
};
