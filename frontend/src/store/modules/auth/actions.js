export default{
  async login(context, payload){
   return context.dispatch('auth', {
      ...payload
  });
  },

  logout(context){
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    context.commit('setUser', {
      token: null,
      user: null,
    });
  },

  async auth(context, payload){
    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: payload.username,
        password: payload.password,
      })
    });
    const responseData = await response.json();

    if(!response.ok){
      console.log(responseData);
      const error = new Error(responseData.message || 'Failed to authenticate. Check your login data.');
      throw error;
    }

    localStorage.setItem('token', responseData.token);
    localStorage.setItem('user', JSON.stringify(responseData.user));

    console.log(responseData);
    context.commit('setUser', {
      token: responseData.token,
      user: responseData.user,
    });
  },

  tryLogin(context){
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if(token && user){
      context.commit('setUser', {
        token: token,
        user: user,
      });
    }
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
