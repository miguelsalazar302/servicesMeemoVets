export const userDataLocalStorage = 'user_data';
export const configDataLocalStorage = 'config_data';

// HEADER
export const headerNavId = 'headerNav';
export const setNavLinksEvent = 'setNavLinks';

export const LOCAL_USER_TOKEN_KEY = 'userToken';
export const localUserToken = 'localToken';

// USER TYPES
export const USER_TYPE_PET_OWNER = 'pet_owner';
export const USER_TYPE_VET = 'vet';
export const USER_TYPE_GUEST_USER = 'guest_user';
export const USER_TYPE_SERVICE = 'service';

// USER STATUS
export const USER_STATUS_PENDING = 'pending';

// BOOKING STATUS
export const BOOKING_STATUS_CREATED = 'created'; // Booking creado pero SIN pago efectuado
export const BOOKING_STATUS_PENDING = 'pending'; // Booking creado con pago efectuado
export const BOOKING_STATUS_CONFIRMED = 'confirmed'; // Cuando el veterinario confirma la fecha despues del chat
export const BOOKING_STATUS_COMPLETED = 'completed'; // Cuando el veterinario fue al lugar y lleno la historia clinica
export const BOOKING_STATUS_CANCELED = 'canceled'; // Cuando se cancelo
export const BOOKING_STATUS_REJECTED = 'rejected'; // cuando el veterinario rechazo la visita

export const BOOKING_STATUS_LABELS = {};
BOOKING_STATUS_LABELS[BOOKING_STATUS_CREATED] = 'Creada';
BOOKING_STATUS_LABELS[BOOKING_STATUS_PENDING] = 'Pendiente';
BOOKING_STATUS_LABELS[BOOKING_STATUS_CONFIRMED] = 'Confirmada';
BOOKING_STATUS_LABELS[BOOKING_STATUS_COMPLETED] = 'Completada';
BOOKING_STATUS_LABELS[BOOKING_STATUS_CANCELED] = 'Cancelada';
BOOKING_STATUS_LABELS[BOOKING_STATUS_REJECTED] = 'Rechazada';
