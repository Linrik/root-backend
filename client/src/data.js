const axios = require('axios').default
const serverAdress = "http://localhost:5000"
const routeOptions = {
    event: "/event",
    participant: "/event/participants",
    article: "/article"
}
export const errorResponse = {
    e1: "Error getting data"
}

export const getArticles = async () => {
    await axios({
        method: "get",
        url: (serverAdress+routeOptions.article),
        withCredentials: true,
    }).then((response)=>{
        return response.data;
    }).catch((error)=>{
        return {error: errorResponse.e1};
    })
}
export const postArticles = async () => {
    
}
export const getEvents = async () => {
    await axios({
        method: "get",
        url: (serverAdress+routeOptions.event),
        withCredentials: true,
    }).then((response)=>{
        return response.data;
    }).catch((error)=>{
        return {error: errorResponse.e1};
    })
}
export const postEvents = async () => {
    
}
export const joinEvent = async (eventid) => {
    await axios({
        method: "put",
        url: (serverAdress+routeOptions.participant),
        data: {eventid: eventid},
        withCredentials: true,
    }).then((response)=>{
        return response.data;
    }).catch((error)=>{
        return {error: errorResponse.e1};
    })
}
