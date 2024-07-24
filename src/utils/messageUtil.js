import { ElMessage, ElLoading, ElMessageBox } from "element-plus";

const MESSAGE_TYPE_SUCCESS = 'success';
const MESSAGE_TYPE_WARNING = 'warning';
const MESSAGE_TYPE_INFO = 'info';
const MESSAGE_TYPE_ERROR = 'error';

export const MESSAGE_TYPE = {
    MESSAGE_TYPE_SUCCESS: MESSAGE_TYPE_SUCCESS,
    MESSAGE_TYPE_WARNING: MESSAGE_TYPE_WARNING,
    MESSAGE_TYPE_INFO: MESSAGE_TYPE_INFO,
    MESSAGE_TYPE_ERROR: MESSAGE_TYPE_ERROR
}

export const Message = (message, type) => {
    message = message || null;
    type = type || MESSAGE_TYPE_INFO;
    ElMessage({
        message: message,
        type: type,
        duration: 3.5 * 1000
    })
}
    