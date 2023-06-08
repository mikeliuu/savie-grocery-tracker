export const upperLetterAfterUnderScore = (str) =>
  str
    ?.toLowerCase()
    ?.split('_')
    ?.map((text, index) =>
      index > 0 ? text?.charAt(0)?.toUpperCase() + text?.slice(1) : text,
    )
    ?.join('');

export const toCamelCaseObjectKey = (data: any[]) => {
  return data?.map((item) => {
    const covnerted = Object.entries(item)?.map((entry) => {
      entry[0] = upperLetterAfterUnderScore(entry[0]);

      return entry;
    });

    return Object.fromEntries(covnerted);
  });
};
