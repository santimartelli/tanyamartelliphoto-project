let timer;

export default {
  async login(context, payload) {
    return context.dispatch("auth", {
      ...payload,
    });
  },

  async auth(context, payload) {
    const response = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: payload.username,
        password: payload.password,
      }),
    });
    const responseData = await response.json();

    if (!response.ok) {
      console.log(responseData);
      const error = new Error(
        responseData.message || "Failed to authenticate. Check your login data."
      );
      throw error;
    }

    const expiresIn = responseData.expiresIn * 1000; // Convierte a milisegundos
    const tokenExpirationDate = new Date().getTime() + expiresIn;

    localStorage.setItem("token", responseData.token);
    localStorage.setItem("user", JSON.stringify(responseData.user));
    localStorage.setItem("tokenExpiration", tokenExpirationDate);

    clearTimeout(timer);
    timer = setTimeout(function(){
      context.dispatch("autoLogout")
    }, expiresIn);

    context.commit("setUser", {
      token: responseData.token,
      user: responseData.user,
    });
  },

  tryLogin(context) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const tokenExpiration = localStorage.getItem("tokenExpiration");
    const expiresIn = +tokenExpiration - new Date().getTime();

    if (expiresIn < 10000) {
      return;
    }

    clearTimeout(timer);
    timer = setTimeout(function () {
      context.dispatch("autoLogout")
    }, expiresIn);

    if (token && user) {
      context.commit("setUser", {
        token: token,
        user: user,
      });
    }
  },

  autoLogout(context) {
    context.dispatch("logout");
    context.commit("setAutoLogout");
  },

  logout(context) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiration");

    clearTimeout(timer);

    context.commit("setUser", {
      token: null,
      user: null,
    });
  },

  // async signUp(context, payload){
  //   fetch('http://localhost:3000/api/users/sign-up', {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       username: payload.username,
  //       password: payload.password,
  //     })
  //   });

  //   const responseData = await response.json();

  //   if(!response.ok){
  //     console.log(responseData);
  //     const error = new Error(responseData.message || 'Failed to authenticate. Check your login data.');
  //     throw error;
  //   }

  //   console.log(responseData);
  //   context.commit('setUser', {
  //     userId: responseData.id,
  //   });
  // }
};
