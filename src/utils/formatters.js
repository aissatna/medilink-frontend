export const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    return phone.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
};

export const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};