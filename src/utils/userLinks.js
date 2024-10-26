const links = [
    { title: 'HOME', icon: 'mdi mdi-home-outline', route: "/home" },
    { title: 'PATIENTS', icon: 'mdi mdi-account-heart-outline', route: "/patients" },
    { title: 'NURSES', icon: 'mdi mdi-account-group', route: "/nurses" },
    { title: 'VISITS', icon: 'mdi mdi-calendar-check', route: "/visits" },
    { title: 'SECRETARIES', icon: 'mdi mdi-account-settings-outline', route: "/secretaries" },
    { title: 'CABINET', icon: 'mdi mdi-office-building', route: "/cabinet" },
];

const userLinks = (role) => {
    const roleLinks = {
        'director': ['HOME', 'SECRETARIES', 'CABINET'],
        'secretary': ['HOME', 'PATIENTS', 'NURSES', 'VISITS'],
        'nurse': ['HOME', 'VISITS'],
    };
    return links.filter(link => roleLinks[role.toLowerCase()].includes(link.title));
};

export default userLinks;