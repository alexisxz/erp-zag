export const convertFirestoreDate = (date, action) => {
  if (!date) return;

  const convertedDate = date.toDate();

  if (action === "inString") return convertedDate.toLocaleDateString("de-DE");

  return convertedDate;
};
