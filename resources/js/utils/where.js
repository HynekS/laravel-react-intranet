const where = (arr, conditions = {}) =>
  [].concat(arr).filter(elem => {
    for (let [key, value] of Object.entries(conditions)) {
      if (elem[key] !== value) return false;
    }
    return true;
  });

export default where;