const errorQueue = []; // 用于存放错误信息的队列
const MAX_QUEUE_SIZE = 50; // 定义队列的最大长度，达到这个长度时立即上传
const UPLOAD_INTERVAL = 10000; // 定义定时上传的时间间隔（比如10秒）

// 将错误信息加入队列
function enqueueError(err) {
    errorQueue.push(err);
    if (errorQueue.length >= MAX_QUEUE_SIZE) {
        uploadErrors();
    }
}

// 定时上传错误信息
setInterval(() => {
    if (errorQueue.length > 0) {
        uploadErrors();
    }
}, UPLOAD_INTERVAL);

// 上传错误信息
async function uploadErrors() {
    if (errorQueue.length === 0) return;

    const errorsToUpload = [...errorQueue];
    errorQueue.length = 0;

    try {
        await CommonApi.ErrorCollection(errorsToUpload);
    } catch (error) {
        console.error("上传错误失败", error);
        errorQueue.unshift(...errorsToUpload);
    }
}

export default {
    async errorHandler(err) {
        console.log('触发errorHandler');
        enqueueError(err);
    },
    async resourceerror(err) {
        console.log('触发resourceerror');
        enqueueError(err);
    },
    async onerror(err) {
        console.log('触发onerror');
        enqueueError(err);
    }
};
