import axiosInstance from "../axiosInstance";

// const CURRENT_API_BASE_URL = 'http://localhost:8070/users/current';

export default {
    getCurrentUser: function () {
        return axiosInstance.get('/users/current', { authRequired: true });
    },
};