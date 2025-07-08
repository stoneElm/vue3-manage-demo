/**
 * Vue3 实用工具类
 * 包含 UUID 生成和时间格式化功能
 */
export default {
    /**
     * 生成 UUID
     * @param {boolean} hyphen 是否包含连字符（默认true）
     * @returns {string} UUID字符串
     */
    generateUUID(hyphen = true) {
        let d = new Date().getTime()
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (d + Math.random() * 16) % 16 | 0
            d = Math.floor(d / 16)
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
        })
        return hyphen ? uuid : uuid.replace(/-/g, '')
    },

    /**
     * 生成短UUID (8位)
     * @returns {string} 短UUID
     */
    generateShortUUID() {
        return Math.random().toString(36).substring(2, 10)
    },

    /**
     * 获取当前时间
     * @param {string} format 格式，默认 'YYYY-MM-DD HH:mm:ss'
     * @returns {string} 格式化后的时间字符串
     */
    getCurrentTime(format = 'YYYY-MM-DD HH:mm:ss') {
        const date = new Date()
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds)
    },

    /**
     * 格式化时间戳
     * @param {number|string} timestamp 时间戳
     * @param {string} format 格式，默认 'YYYY-MM-DD HH:mm:ss'
     * @returns {string} 格式化后的时间字符串
     */
    formatTime(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
        const date = new Date(Number(timestamp))
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds)
    },

    /**
     * 获取当前时间戳（毫秒）
     * @returns {number} 当前时间戳
     */
    getTimestamp() {
        return new Date().getTime()
    },

    /**
     * 获取当前日期（不带时间）
     * @returns {string} YYYY-MM-DD格式日期
     */
    getCurrentDate() {
        return this.getCurrentTime('YYYY-MM-DD')
    }
}