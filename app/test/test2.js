async function testB() {
  return await Promise.resolve();
}

testB().then(() => console.log(1));
Promise.resolve()
  .then(() => console.log(2))
  .then(() => console.log(3));
