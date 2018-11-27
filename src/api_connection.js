import axios from 'axios'

export const API = axios.create({
  baseURL: `http://34.192.233.68:8080/`,
  responseType: 'json',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
