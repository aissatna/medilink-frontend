import axiosInstance from "../axiosInstance";

export default {
    getNurses: function (pageNumber, pageSize, sortBy, search) {
        const params = new URLSearchParams({
            page: pageNumber,
            size: pageSize,
        });
        if (sortBy.length) {
            params.append('sort', `${sortBy[0].key},${sortBy[0].order}`);
        }
        if (search) {
            params.append('search', search);
        }
        return axiosInstance.get('/nurses/table', { params });

    },
    addNewNurse: function (formData) {
        return axiosInstance.post('/nurses/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    updateNurse: function (nurseId, formData) {
        return axiosInstance.put(`/nurses/update/${nurseId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    deleteNurse: function (nursesId) {
        return axiosInstance.delete(`/nurses/delete/${nursesId}`);
    },

    exportNurses: function (search) {
        return axiosInstance.post('/nurses/export', null, {
            params: { search },
        });

    },

};
