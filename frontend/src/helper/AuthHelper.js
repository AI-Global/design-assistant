import axios from 'axios';

const key = "authToken";

export function expireAuthToken(){
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
}

export function getLoggedInUser(){
    console.log(sessionStorage.getItem(key));
    let authToken = localStorage.getItem(key) ?? sessionStorage.getItem(key);
    if(!authToken){
        return
    }
    return axios.get('http://localhost:9000/users/user', {
        headers: {
            "x-auth-token": authToken
        }
    }).catch(err => {
        console.log("Login Expired. Please Sign In");
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    })
    .then(response => {
        if(response){
            let result = response.data;
            return result;
        }
    })
}

export function isLoggedIn(){
    let authToken = localStorage.getItem(key) ?? sessionStorage.getItem(key);
    if(!authToken){
        return false
    }
    return axios.get('http://localhost:9000/users/isLoggedIn', {
        headers: {
            "x-auth-token": authToken
        }
    }).catch(err => {
        console.log("Login Expired. Please Sign In");
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
        return false;
    }).then(response =>{return true});

}

export function setAuthToken(){

}