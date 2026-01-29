import axiosInstance from "../axiosInstance";

export default {
    getSecretaries: function (pageNumber, pageSize, sortBy, search) {
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
        return axiosInstance.get('/secretaries/table', { params });

    },
    addNewSecretary: function (formData) {
        return axiosInstance.post('/secretaries/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    updateSecretary: function (secretaryId, formData) {
        return axiosInstance.put(`/secretaries/update/${secretaryId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    deleteSecretary: function (secretaryId) {
        return axiosInstance.delete(`/secretaries/delete/${secretaryId}`);
    },

    exportSecretaries: function (search) {
        return axiosInstance.post('/secretaries/export', null, {
            params: { search },
        });

    },

};
