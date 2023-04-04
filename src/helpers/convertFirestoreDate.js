export const convertFirestoreDate = (date, action) => {
  const convertedDate = date.toDate();

  if (action === "inString") return convertedDate.toLocaleDateString("de-DE");

  return convertedDate;
};
