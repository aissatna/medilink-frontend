import axiosInstance from "../axiosInstance";

export default {
    getPatients: function (pageNumber, pageSize, sortBy, search) {
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
        return axiosInstance.get('/patients/table', { params });

    },


    addNewPatient: function (patient) {
        return axiosInstance.post('/patients/add', patient);
    },

    deletePatient: function (patientId) {
        return axiosInstance.delete(`/patients/delete/${patientId}`);
    },

    updatePatient: function (patient) {
        return axiosInstance.put(`/patients/update/${patient.id}`, patient);
    },

    exportPatients: function (search) {
        return axiosInstance.post('/patients/export', null, {
            params: { search },
        });
    },

};