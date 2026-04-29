function dclone(obj, map = new WeakMap()) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  if (map.has(obj)) {
    return map.get(obj);
  }
  const newObj = Array.isArray(obj) ? [] : {};
  map.set(obj, newObj);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = dclone(obj[key], map);
    }
  }
  return newObj;
}
