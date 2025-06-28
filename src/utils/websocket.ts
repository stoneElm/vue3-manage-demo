// utils/websocket.ts (Pinia 示例)
import { defineStore } from 'pinia'
import api from "@/api/api.js";

var baseURL = api.defaults.baseURL;
var wsURL = baseURL.replaceAll("https", "ws").replaceAll("http", "ws");

export const useWebSocketStore = defineStore('websocket', {
    state: () => ({
        socket: null,
        connected: false,
        subscriptions: new Set(),
        listeners: {},
        reconnectAttempts: 0,
        maxReconnectAttempts: 5,
        messages: [], // 存储接收的消息
        lastMessages: null,
        error: null   // 存储错误信息
    }),
    actions: {
        connect(url) {
            if (this.socket) return // 已存在连接则不再创建

            // 如果未登录
            if (!sessionStorage.getItem('Stone-Token')) {
                console.log('当前用户未登录，不允许连接webSocket！')
                return;
            }

            url = wsURL + '/webSocket';
            this.socket = new WebSocket(url, ['Stone-Token', sessionStorage.getItem('Stone-Token')])

            this.socket.onopen = () => {
                this.connected = true
                console.log('WebSocket 连接已建立');
            }

            this.socket.onmessage = (event) => {
                console.log('收到消息:', event.data)
                // 可以在这里触发自定义事件或回调
                this.onmessage(event)
            }

        },

        onmessage(event) {
            
        },
        
        // 关闭 WebSocket 连接
        disconnect() {
            if (this.socket) {
                this.socket.close()
                this.socket = null
                this.connected = false
            }
            console.log('----- 关闭websocket连接成功 -----')
        },

        // 发送消息
        sendMessage(message) {
            if (!this.connected || !this.socket) {
                throw new Error('WebSocket is not connected')
            }

            if (typeof message !== 'string') {
                message = JSON.stringify(message)
            }

            this.socket.send(message)
        },

        // 重新连接
        reconnect(url) {
            this.disconnect()
            this.connect(url)
        },

        // 清除所有消息
        clearMessages() {
            this.messages = []
        },

        // 获取最新消息
        getLatestMessage() {
            return this.messages.length > 0
                ? this.messages[this.messages.length - 1]
                : null
        },

        // 心跳检测
        startHeartbeat(interval = 30000) {
            if (this.heartbeatInterval) clearInterval(this.heartbeatInterval)

            this.heartbeatInterval = setInterval(() => {
                if (this.connected) {
                    this.sendMessage({ type: 'heartbeat' })
                }
            }, interval)
        },

        // 停止心跳
        stopHeartbeat() {
            if (this.heartbeatInterval) {
                clearInterval(this.heartbeatInterval)
                this.heartbeatInterval = null
            }
        },

        // 订阅频道
        subscribe(channel) {
            this.sendMessage({
                type: 'subscribe',
                channel: channel
            })
        },

        // 取消订阅
        unsubscribe(channel) {
            this.sendMessage({
                type: 'unsubscribe',
                channel: channel
            })
        },

        // 自动重连机制
        setupAutoReconnect(url, maxAttempts = 5, delay = 1000) {
            let attempts = 0

            const reconnect = () => {
                if (attempts >= maxAttempts) {
                    console.error('Max reconnection attempts reached')
                    return
                }

                setTimeout(() => {
                    attempts++
                    console.log(`Reconnecting attempt ${attempts}`)
                    this.connect(url)
                }, delay * attempts) // 指数退避
            }

            this.socket.onclose = () => {
                this.connected = false
                reconnect()
            }
        }
    }
})