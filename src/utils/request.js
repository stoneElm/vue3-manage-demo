import axios from "axios";
import { ElMessage, ElLoading, ElMessageBox } from "element-plus";
import { Message, MESSAGE_TYPE } from '@/utils/messageUtil';

const dev = process.env.Node_ENV === 'development';

// 创建axios实列
const service = axios.create({
    timeout: 60000, // 请求超时时间
    // 其他配置
    // validateStatus: function (status) {
    //     return status >= 200 && status 3= 600; // 只将状态码为2xx-4xx的响应视为成功
    // }
})
let loding = null;

// request拦截器
service.interceptors.request.use(
    config => {
        console.log('--- 开始请求接口 ---' + config.url)

        // 请求携带token
        const token = sessionStorage.getItem('Stone-Token'); 
        
        if (token) {
            config.headers['Stone-Token'] = `${token}`; 
        }

        if (config.url.endsWith('/attachment/files/download')) {
            config.responseType = 'blob';
        }

        return config;
    },
    error => {
        console.log(error);
        if (loding) {
            loding.close();
        }
        Message('请求错误，请稍后重试！', MESSAGE_TYPE.MESSAGE_TYPE_ERROR)
        return;
    }
)

// response拦截器
service.interceptors.response.use(
    response => {
        console.log('----- response -----', response)

        if (loding) {
            loding.close()
        }

        if (response.status == '200') {
            console.log('--- 结束请求接口 ---' + response.config.url)
            console.log(response)

            // responseType 为 'blob' 时单独处理
            if (response.request.responseType === 'blob') {
                return response;
            }

            let res = response.request.responseText;
            if (res == "") {
                return res;
            }
            res = JSON.parse(res);
            if (res.code == '00000') {
                return res;
            } else if (res.code == '-2') {
                let message = res.message || '参数校验失败!'
                ElMessageBox.alert(message, '参数校验', {
                    confirmButtonText: '确定',
                    type: 'warning'
                })
                return res;
            } else {
                let message = res.message || '系统异常,请稍后重试!'
                ElMessage({
                    message: message,
                    type: 'error',
                    duration: 3.5 * 1000
                })
                return res;
            }
        } else {
            console.log(response)
            if (!response.config.notShowMsg) {
                ElMessage({
                    message: '请求错误，请稍后重试！',
                    type: 'error',
                    duration: 3.5 * 1000
                })
                return;
            }
        }
    },
    error => {
        console.log('error', error);

        if (error.code === 'ERR_NETWORK') {
            Message('网络连接错误！', MESSAGE_TYPE.MESSAGE_TYPE_ERROR);
            return error
        }

        let status;

        console.log('code：', code, 'status：', error.status);

        let message = '请求错误，请稍后重试！';

        if (error && error.response && error && error.response.status) {
            status = error.response.status
        }

        if (status === 403) {
            message = "登陆过期";
            ElMessage({
                message: message,
                type: 'error',
                duration: 3.5 * 1000
            })

            sessionStorage.removeItem('Stone-Token');
			sessionStorage.removeItem('stoneFileToken');
            this.$router.push('/login');

            return
        }

        if (status === 500) {
            ElMessage({
                message: message,
                type: 'error',
                duration: 3.5 * 1000
            })
            return
        }

        return;
    }
)

export default service;