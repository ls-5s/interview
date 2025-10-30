function deepClone(target, map = new WeakMap()) {
 if(target instanceof Date){
    return new Date(target);
 }
 if(target instanceof RegExp){
    return new RegExp(target);
 }
 if(map.has(target)){
    return map.get(target);
 }
 const clone = Array.isArray(target) ? [] : {};
 map.set(target,clone);
 <!-- for(let key in target){
    if(target.hasOwnProperty(key)){
        clone[key] = deepClone(target[key],map);
    }
 } -->
 for(let key of target){
    if(target.hasOwnProperty(key)){
        clone[key] = deepClone(target[key],map);
    }
 }
 return clone;
}

function sClone(target) {
    if(typeof target !== 'object' || target === null){
        return target;
    }
    const clone = Array.isArray(target) ? [] : {};
    if(clone) {
        for(let key of target){
            clone[key] = sClone(target[key]);
        }
    }else {
        for(let key in target){
            if(target.hasOwnProperty(key)){
                clone[key] = sClone(target[key]);
            }
        }
    }
        
    }
}