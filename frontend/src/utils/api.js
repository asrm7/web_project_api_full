import * as token from "./token.js";
class Api {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  _getAuthorizationHeaders() {
    return {
      ...this._headers,
      authorization: `Bearer ${token.getToken()}`,
    }
  }

  getUserInfo() {
    return fetch(`${this.baseUrl}/users/me`, {
      headers: this._getAuthorizationHeaders(),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        
        return Promise.reject(`Error: ${res.status}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getInitialCards() {
    return fetch(`${this.baseUrl}/cards`, {
      headers: this._getAuthorizationHeaders(),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Error: ${res.status}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateUserProfile(name, about) {
    return fetch(`${this.baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._getAuthorizationHeaders(),
      body: JSON.stringify({
        name,
        about,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Error: ${res.status}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  createCard(link, name) {
    return fetch(`${this.baseUrl}/cards`, {
      method: "POST",
      headers: this._getAuthorizationHeaders(),
      body: JSON.stringify({
        link,
        name,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        
        return Promise.reject(`Error: ${res.status}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  deleteCard(cardId) {
    return fetch(`${this.baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._getAuthorizationHeaders(),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        
        return Promise.reject(`Error: ${res.status}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  changeLikeCardStatus(cardId, isLiked) {
    
    return fetch(`${this.baseUrl}/cards/likes/${cardId}`, {
      method: isLiked ? "DELETE" : "PUT", 
      headers: this._getAuthorizationHeaders(),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
       
        return Promise.reject(`Error: ${res.status}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateAvatar(avatar) {
    return fetch(`${this.baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._getAuthorizationHeaders(),
      body: JSON.stringify({
        avatar,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        
        return Promise.reject(`Error: ${res.status}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

const api = new Api({
  baseUrl: "https://web-project-api-full-wriv.onrender.com/",
  headers: {
     "Content-Type": "application/json",
  },
});

export default api;



