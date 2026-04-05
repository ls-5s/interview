function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
async function light() {
  while (true) {
    console.log("红灯");
    await sleep(1000);
    console.log("绿灯");
    await sleep(1000);
    console.log("黄灯");
    await sleep(1000);
  }
}
light();
