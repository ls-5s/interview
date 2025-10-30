var arr1 = [1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10]
function unique(arr) {
 let res = []
 for(let i= 0;i <arr.length;i++) {
    if(res.indexOf(arr[i]) === -1) {
      res.push(arr[i])
    }
 }
  return res
}
console.log(unique(arr1))