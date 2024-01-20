import axios from "axios";

let timer;

export default {
  async login(context, payload) {
    return context.dispatch("auth", {
      ...payload,
    });
  },

  async auth(context, payload) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        {
          username: payload.username,
          password: payload.password,
        }
      );
      // Extracting response data
      const responseData = response.data;
      // Calculating token expiration time
      const expiresIn = responseData.expiresIn * 1000; // Convert to milliseconds
      const tokenExpirationDate = new Date().getTime() + expiresIn;
      // Storing token and user information in localStorage
      localStorage.setItem("token", responseData.token);
      localStorage.setItem("user", JSON.stringify(responseData.user));
      localStorage.setItem("tokenExpiration", tokenExpirationDate);
      // Setting up a timer for auto logout
      clearTimeout(timer);
      timer = setTimeout(function () {
        context.dispatch("autoLogout");
      }, expiresIn);
      // Committing user data to the Vuex store
      context.commit("setUser", {
        token: responseData.token,
        user: responseData.user,
      });
    } catch (error) {
      // Handling errors
      console.error(error.response ? error.response.data : error);
      // Extracting error message from response, with a fallback default message
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to authenticate. Check your login data.";
      // Throwing an error to be handled by the caller of the function
      throw new Error(errorMessage);
    }
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
      context.dispatch("autoLogout");
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

  async adminRegistration(context, payload) {
    try {
      console.log(payload);
      const response = await axios.post(
        "http://localhost:3000/api/users/sign-up",
        {
          username: payload.username,
          password: payload.password,
          password_repeat: payload.password_repeat,
        }
      );
      console.log("response data: " + response.data);
      context.commit("setUser", {
        userId: response.data.id,
      });
    } catch (error) {
      console.log(error.response.data);
      const errorMessage = error.response.data.message;
      throw new Error(errorMessage);
    }
  },
};
