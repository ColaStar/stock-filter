/**
 * @description:
 * @author: manble@live.com
 * @created:
 */
 'use strict'

 const request = require('request')
 const http = require('http')
 const https = require('https')
 
 const createKey = (url) => (url ? url.replace(/#.*/, '').split('?')[0] : '')
 class Breaker {
   constructor(options = {}) {
     this.options = Object.assign(
       {
         maxFailures: 500,
         retryTimePeriod: 5000,
       },
       options
     )
     this.breakers = {}
   }
 
   create(name, options = {}) {
     let key = createKey(name)
     if (key && !this.breakers[key]) {
       this.breakers[key] = {
         state: 'CLOSED',
         maxFailures: options.maxFailures || this.options.maxFailures,
         retryTimePeriod: options.retryTimePeriod || this.options.retryTimePeriod,
         failureCount: 0,
         lastFailureTime: null,
       }
     }
   }
 
   setState(name) {
     let key = createKey(name)
     if (key && this.breakers[key]) {
       const { maxFailures, failureCount, retryTimePeriod, lastFailureTime } = this.breakers[key]
       if (maxFailures <= failureCount) {
         if (Date.now() - lastFailureTime > retryTimePeriod) {
           this.breakers[key].state = 'HALF-OPEN'
           return
         }
         this.breakers[key].state = 'OPEN'
         return
       }
       this.breakers[key].state = 'CLOSED'
     }
   }
 
   getState(name) {
     let key = createKey(name)
     return (this.breakers[key] || {}).state || 'CLOSED'
   }
 
   record(name, err) {
     let key = createKey(name)
     if (key && this.breakers[key]) {
       this.setState(key)
       err ? this.breakers[key].failureCount++ : this.breakers[key].failureCount > 0 && this.breakers[key].failureCount--
       err && (this.breakers[key].lastFailureTime = Date.now())
     }
   }
 
   reset(name) {
     let key = createKey(name)
     if (key && this.breakers[key]) {
       this.breakers[key].failureCount = 0
       this.breakers[key].lastFailureTime = null
       this.breakers[key].state = 'CLOSED'
     }
   }
 }
 
 class Retry {
   constructor(options = {}) {
     this.options = Object.assign(
       {
         factor: 2,
         minTimeout: 200,
         maxTimeout: 2000,
         retries: 2,
       },
       options
     )
     const { factor, retries, minTimeout, maxTimeout } = this.options
     this.timeouts = Array.from({ length: retries })
       .map((_, idx) => Math.min(maxTimeout, Math.round(minTimeout * Math.pow(factor, idx))))
       .sort((a, b) => a - b)
     this.count = 0
     this.errors = []
     this.state = 'RETRY'
   }
 
   start(fn) {
     this.fn = fn
     fn(this.count)
   }
 
   stop() {
     this.state = 'STOP'
     this.timer && clearTimeout(this.timer)
   }
 
   retry(err) {
     err && this.errors.push(err)
     this.timer && clearTimeout(this.timer)
     if (!err || this.count >= this.options.retries) {
       return false
     }
     this.count++
     const timeout = this.timeouts.shift()
     this.timer = setTimeout(() => {
       this.state !== 'STOP' && this.fn(this.count)
     }, timeout)
     return true
   }
 
   error() {
     return this.errors[this.errors.length - 1]
   }
 }
 
 const getRequestOptions = function (url, settings, options, method) {
   const { data = {}, paramsType } = settings
   const config = {}
   !settings.short && (config.agent = this.agent[/^https/.test(url) ? 'https' : 'http'])
   config.headers = this.options.headers
   config.timeout = this.options.timeout
   switch (method) {
     case 'post':
       config.method = 'POST'
       switch (paramsType) {
         case 'json':
           config.body = data
           config.json = true
           break
         case 'formData':
           config.formData = data
           break
         default:
           config.form = data
           break
       }
       break
     default:
       config.method = 'GET'
       config.qs = settings.data || {}
       break
   }
   return Object.assign(config, options)
 }
 
 const _request = function (url, settings, options) {
   return new Promise((resolve, reject) => {
     const config = Object.assign({ url }, options)
     const retry = new Retry()
     breaker.create(config.url)
     retry.start(() => {
       const fallback = (err) => {
         settings.defaultRes ? resolve(settings.defaultRes) : reject(err)
       }
       if (breaker.getState(config.url) === 'OPEN') {
         retry.stop()
         fallback(new Error('connect ECONNREFUSED'))
         breaker.setState(config.url)
         return
       }
       request(config, (err, response, body) => {
         breaker.record(config.url, err)
         if (retry.retry(err)) {
           return
         }
         if (err) {
           fallback(retry.error())
           return
         }
         const isJson = /application\/json/.test(response.headers['content-type']) || settings.resType === 'json'
         if (settings.resType === 'raw') {
           resolve(body)
           return
         }
         try {
           resolve(isJson && typeof body !== 'object' ? JSON.parse(body) : body)
         } catch (error) {
           fallback(error)
         }
       })
     })
   })
 }
 
 const breaker = new Breaker()
 
 class Request {
   constructor(options = {}) {
     this.agent = [
       ['http', http],
       ['https', https],
     ].reduce((result, cur) => {
       result[cur[0]] = new cur[1].Agent({
         keepAlive: true,
         maxSockets: 5000,
         maxFreeSockets: 256,
         keepAliveMsecs: 2000,
       })
       return result
     }, {})
     this.options = Object.assign(
       {
         time: true,
         timeout: 3000,
         headers: {
           'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
         },
       },
       options
     )
   }
   get(url, settings = {}, options = {}) {
     return _request.call(this, url, settings, getRequestOptions.call(this, url, settings, options, 'get'))
   }
   /**
    * @param {*} url
    * @param {*} [settings={}]
    *  data 请求需要的数据
    *  paramsType 提交参数类型 json, formData, 默认: application/x-www-form-urlencoded
    *  defaultRes 默认数据
    *  resType 返回数据格式 raw 不做任何处理
    * @param {*} [options={}] 扩展用, request库相关配置
    * @return {*}
    * @memberof Request
    */
   post(url, settings = {}, options = {}) {
     return _request.call(this, url, settings, getRequestOptions.call(this, url, settings, options, 'post'))
   }
 }
 
 module.exports = new Request({ })
 