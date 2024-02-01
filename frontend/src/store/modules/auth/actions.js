import axios from "axios";

let timer;

export default {
  /**
   * Inicia sesion de usuario despachando la acción "auth" con los datos de inicio de sesión.
   * @param {Object} context - El objeto context de Vuex que contiene el estado, los getters, las mutaciones y las acciones del módulo.
   * @param {Object} payload - El payload de autenticación que contiene el nombre de usuario y la contraseña.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando el proceso de autenticación se completa.
   */
  async login(context, payload) {
    return context.dispatch("auth", {
      ...payload,
    });
  },

  /**
   * Autentica al usuario enviando una solicitud POST al endpoint de la API de inicio de sesión.
   * @param {Object} context - El objeto context de Vuex que contiene el estado, los getters, las mutaciones y las acciones del módulo.
   * @param {Object} payload - El payload de autenticación que contiene el nombre de usuario y la contraseña.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando el proceso de autenticación se completa.
   * @throws {Error} - Si la autenticación falla, se lanza un error con el mensaje de error.
   */
  async auth(context, payload) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        {
          username: payload.username,
          password: payload.password,
        }
      );
      // extrae los datos de la respuesta
      const responseData = response.data;

      // calcula la fecha de expiración del token
      const expiresIn = responseData.expiresIn * 1000; // Convert to milliseconds
      const tokenExpirationDate = new Date().getTime() + expiresIn;

      // Almacena el token, el usuario y la fecha de expiración del token en localStorage
      localStorage.setItem("token", responseData.token);
      localStorage.setItem("user", JSON.stringify(responseData.user));
      localStorage.setItem("tokenExpiration", tokenExpirationDate);

      // Establece un temporizador para el cierre de sesión automático
      clearTimeout(timer);
      timer = setTimeout(function () {
        context.dispatch("autoLogout");
      }, expiresIn);

      // Hace un commit con el token y los datos del usuario para mutar el estado
      context.commit("setUser", {
        token: responseData.token,
        user: responseData.user,
      });
    } catch (error) {
      console.error(error.response ? error.response.data : error);
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to authenticate. Check your login data.";
      throw new Error(errorMessage);
    }
  },

  /**
   * Intenta iniciar sesión automáticamente si el token de acceso aún no ha expirado,
   * calcula el tiempo restante hasta que expire y hace un commit con el token y los datos del
   * usuario para mutar el estado.
   * @param {Object} context - El objeto context con todas las propiedades y métodos de Vuex.
   */
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

  /**
   * Cierra la sesión automáticamente eliminando el token, el usuario
   * y la información de expiración del token de localStorage.
   * @param {Object} context - El objeto context de Vuex.
   */
  autoLogout(context) {
    context.dispatch("logout");
    context.commit("setAutoLogout");
  },

  /**
   * Cierra la sesión del usuario eliminando el token, el usuario.
   * @param {Object} context - El objeto context de Vuex.
   */
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

  /**
   * Registra un nuevo usuario enviando una solicitud POST al endpoint de la API de registro.
   * @param {Object} context - El objeto context de Vuex.
   * @param {Object} payload - El payload de registro que contiene el nombre de usuario, la contraseña y la confirmación de la contraseña.
   * @returns {Promise} - Devuelve una promesa que se resuelve cuando el proceso de registro se completa.
   * @throws {Error} - Si el registro falla, se lanza un error con el mensaje de error.
   */
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
