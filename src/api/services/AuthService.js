import axiosInstance from "../axiosInstance";


export default {
  signIn: function (userCredentials) {
    return axiosInstance.post('/auth/signin', userCredentials, { authRequired: false });
  },

  resetPassword: function (email) {
    const params = new URLSearchParams({
      email: email,
    });
    return axiosInstance.put('/auth/password/reset', params, { authRequired: false });

  },

};


