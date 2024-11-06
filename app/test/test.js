// class MyPromise {
// 	constructor(executor) {
// 		this.state = "pending"; // 初始状态
// 		this.value = undefined; // 成功返回的值
// 		this.reason = undefined; // 失败原因
// 		this.onFulfilledCallbacks = []; // 成功回调
// 		this.onRejectedCallbacks = []; // 失败回调

// 		const resolve = (value) => {
// 			if (this.state === "pending") {
// 				this.state = "fulfilled";
// 				this.value = value;
// 				this.onFulfilledCallbacks.forEach((fn) => fn());
// 			}
// 		};

// 		const reject = (reason) => {
// 			if (this.state === "pending") {
// 				this.state = "rejected";
// 				this.reason = reason;
// 				this.onRejectedCallbacks.forEach((fn) => fn());
// 			}
// 		};

// 		try {
// 			executor(resolve, reject);
// 		} catch (error) {
// 			reject(error);
// 		}
// 	}

// 	then(onFulfilled, onRejected) {
// 		onFulfilled =
// 			typeof onFulfilled === "function" ? onFulfilled : (value) => value;
// 		onRejected =
// 			typeof onRejected === "function"
// 				? onRejected
// 				: (reason) => {
// 						throw reason;
// 				  };

// 		let promise2 = new MyPromise((resolve, reject) => {
// 			if (this.state === "fulfilled") {
// 				setTimeout(() => {
// 					try {
// 						let x = onFulfilled(this.value);
// 						resolvePromise(promise2, x, resolve, reject);
// 					} catch (error) {
// 						reject(error);
// 					}
// 				});
// 			}

// 			if (this.state === "rejected") {
// 				setTimeout(() => {
// 					try {
// 						let x = onRejected(this.reason);
// 						resolvePromise(promise2, x, resolve, reject);
// 					} catch (error) {
// 						reject(error);
// 					}
// 				});
// 			}

// 			if (this.state === "pending") {
// 				this.onFulfilledCallbacks.push(() => {
// 					setTimeout(() => {
// 						try {
// 							let x = onFulfilled(this.value);
// 							resolvePromise(promise2, x, resolve, reject);
// 						} catch (error) {
// 							reject(error);
// 						}
// 					});
// 				});

// 				this.onRejectedCallbacks.push(() => {
// 					setTimeout(() => {
// 						try {
// 							let x = onRejected(this.reason);
// 							resolvePromise(promise2, x, resolve, reject);
// 						} catch (error) {
// 							reject(error);
// 						}
// 					});
// 				});
// 			}
// 		});

// 		return promise2;
// 	}
// }

// function resolvePromise(promise2, x, resolve, reject) {
// 	if (promise2 === x) {
// 		return reject(new TypeError("Chaining cycle detected for promise"));
// 	}

// 	let called = false;
// 	if (x !== null && (typeof x === "object" || typeof x === "function")) {
// 		try {
// 			let then = x.then;
// 			if (typeof then === "function") {
// 				then.call(
// 					x,
// 					(y) => {
// 						if (called) return;
// 						called = true;
// 						resolvePromise(promise2, y, resolve, reject);
// 					},
// 					(r) => {
// 						if (called) return;
// 						called = true;
// 						reject(r);
// 					}
// 				);
// 			} else {
// 				resolve(x);
// 			}
// 		} catch (error) {
// 			if (called) return;
// 			called = true;
// 			reject(error);
// 		}
// 	} else {
// 		resolve(x);
// 	}
// }


// // let a = new MyPromise((resolve, reject) => {
// // 	setTimeout(() => {
// // 		resolve(1);
// // 	}, 1000);
// // });

// // a.then((res) => {
// // 	console.log(res);
// // });

// new MyPromise(setTimeout(() => {
// 	console.log(1);
// }, 1000))