export const getSideBarList = (list: string[]) => {
  if (!list) return;

  const fullList = ["warehouse", "anfragen", "auftrag"];
  let finalList: string[] = [];

  if (list.find((list) => list === "admin")) return fullList.sort();

  // get list by list
  if (list.find((list) => list === "warehouse")) {
    finalList = [...finalList, "warehouse"];
  }

  if (list.find((list) => list === "anfragen")) {
    finalList = [...finalList, "anfragen"];
  }

  if (list.find((list) => list === "auftrag")) {
    finalList = [...finalList, "auftrag"];
  }

  return finalList.sort();
};
