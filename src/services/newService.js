import Request from './request'

export default class NewService {
    static async adminGetList(data = {}) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/StationNews/advanceUser/getList',
                data
              }).then((result = {})=>{
                const { statusCode, data } = result
                if(statusCode === 200) {
                    return resolve(data)
                }else{
                    return resolve({ })
                }
              })
        })
    }
    static async userGetList(skip) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/StationNews/advanceUser/getNewsList',
                data: {
                    "skip": skip,
                    "limit": 20,
                    "stationsUrl": window.origin.split('://')[1]
                }
              }).then((result = {})=>{
                const { statusCode, data } = result
                if(statusCode === 200) {
                    return resolve(data)
                }else{
                    return resolve({ })
                }
              })
        })
    }
    static async userGetHotNew(skip) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/StationNews/advanceUser/getHotNewsList',
                data: {
                    "skip": skip,
                    "limit": 20,
                    "stationsUrl": window.origin.split('://')[1]
                }
              }).then((result = {})=>{
                const { statusCode, data } = result
                if(statusCode === 200) {
                    return resolve(data)
                }else{
                    return resolve({ })
                }
              })
        })
    }
    static async postNew(data = {}) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/StationNews/advanceUser/addNews',
                data
              }).then((result = {})=>{
                const { statusCode } = result
                if(statusCode === 200) {
                    return resolve({ isSuccess: true })
                }else{
                    return resolve({ isSuccess: false})
                }
              })
        })
    }
    static async updateANew(data = {}) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/StationNews/advanceUser/updateById',
                data
              }).then((result = {})=>{
                const { statusCode } = result
                if(statusCode === 200) {
                    return resolve({ isSuccess: true })
                }else{
                    return resolve({ isSuccess: false})
                }
              })
        })
    }
    static async adminGetDetailById(id) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/StationNews/advanceUser/getDetailById',
                data: {
                    id: id
                }
              }).then((result = {})=>{
                const { statusCode, data } = result
                if(statusCode === 200) {
                    return resolve(data)
                }else{
                    return resolve({ })
                }
              })
        })
    }
    static async userGetDetailById(id) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/StationNews/advanceUser/getNewsDetail',
                data: {
                    id
                }
              }).then((result = {})=>{
                const { statusCode, data } = result
                if(statusCode === 200) {
                    return resolve(data)
                }else{
                    return resolve({ })
                }
              })
        })
    }

    static async userFetchListCategory() {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/StationNewsCategory/advanceUser/getList',
                data: {
                    filter: {},
                    "skip": 0,
                    "limit": 20,
                }
              }).then((result = {})=>{
                const { statusCode, data } = result
                if(statusCode === 200) {
                    return resolve(data.data)
                }else{
                    return resolve([])
                }
              })
        })
    }

    static async getListCategory(skip=0) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/StationNewsCategory/advanceUser/getList',
                data: {
                    "skip": skip,
                    "limit": 20
                }
              }).then((result = {})=>{
                const { statusCode, data } = result
                if(statusCode === 200) {
                    return resolve(data)
                }else{
                    return resolve([])
                }
              })
        })
    }

    static async addCategory(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/StationNewsCategory/insert',
                data
              }).then((result = {})=>{
                const { statusCode } = result
                if(statusCode === 200) {
                    return resolve({ isSuccess: true })
                }else{
                    return resolve({ isSuccess: false})
                }
              })
        })
    }

    static async updateCategory(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/StationNewsCategory/updateById',
                data
              }).then((result = {})=>{
                const { statusCode } = result
                if(statusCode === 200) {
                    return resolve({ isSuccess: true })
                }else{
                    return resolve({ isSuccess: false})
                }
              })
        })
    }

    static async deleteCategory(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/StationNewsCategory/deleteById',
                data
              }).then((result = {})=>{
                const { statusCode } = result
                if(statusCode === 200) {
                    return resolve({ isSuccess: true })
                }else{
                    return resolve({ isSuccess: false})
                }
              })
        })
    }
}