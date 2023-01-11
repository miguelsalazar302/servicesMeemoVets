import {USER_TYPE_VET} from "./constants";
// import Config from "react-native-config/index";

import { apiURL } from "./api-base.js";
// apiURL = 'http://0835bda3.ngrok.io';

// PROD
/*if(Config.NODE_ENV === 'prod') {
    apiURL = 'https://api.meemo.vet';
}*/

// DEV
/*if(Config.NODE_ENV === 'dev') {
    // Podemos despues ajustar la apiURL acá...
    apiURL = 'http://192.168.0.14:9001';
    // apiURL = 'http://10.197.106.188:9001'
}*/

// MOCK
/*if(Config.NODE_ENV === 'mock') {
    // Podemos despues ajustar la apiURL acá...
    apiURL = 'http://192.168.0.14:9001';
}*/

// NGROK
/*if(Config.NODE_ENV === 'ngrok') {
    // Podemos despues ajustar la apiURL acá...
    apiURL = 'http://cc1ac916.ngrok.io'
}*/

// console.log('APIURL:', apiURL);
// console.log('NODE_ENV:', Config.NODE_ENV);

const apiVersion = '/v1/';

export const apiURL_config = apiURL + apiVersion + 'config/';

export const apiURL_user = apiURL + apiVersion + 'users/';

export const apiURL_vets = apiURL + apiVersion + 'vets/';

export const apiURL_services = apiURL + apiVersion + 'services/';

export const apiURL_bookings = apiURL + apiVersion + 'bookings/';

export const apiURL_clinic_histories = apiURL + apiVersion + 'clinic_histories/';

export const apiURL_pets = apiURL + apiVersion + 'pets/';

export const apiURL_pets_types = apiURL + apiVersion + 'pets_types/';

export const apiURL_pets_adjectives = apiURL + apiVersion + 'pets_adjectives/';

export const apiURL_pets_genders = apiURL + apiVersion + 'pets_genders/';

export const apiURL_pets_diets = apiURL + apiVersion + 'pets_diets/';

export const apiURL_pets_habits = apiURL + apiVersion + 'pets_habits/';

export const apiURL_pets_sizes = apiURL + apiVersion + 'pets_sizes/';

export const apiURL_messages = apiURL + apiVersion + 'messages/';

export const apiURL_mp = apiURL + apiVersion + 'mercadopago/';

export const apiURL_mp_check_authorization = apiURL_mp + 'check_authorization/';

export const apiURL_mp_authorize = apiURL_mp + 'authorize/';

export const apiURL_professional_registration_institutes = apiURL + apiVersion + 'professional_registration_institutes/';

export const apiURL_registrations_purposes = apiURL + apiVersion + 'registrations_purposes/';

export const apiURL_specialties = apiURL + apiVersion + 'specialties/';

export const apiURL_races = apiURL + apiVersion + 'pets_races/';

export const apiURL_vaccines = apiURL + apiVersion + 'pets_vaccines/';

export const apiURL_schedules = apiURL + apiVersion + 'schedules/';

export const apiURL_schedules_me = apiURL + apiVersion + 'schedules/me/';

export const apiURL_pet_owners = apiURL + apiVersion + 'pet_owners/';

export const apiURL_pet_owners_me = apiURL_pet_owners + 'me/';

export const apiURL_user_me = apiURL_user + 'me/';

export const apiURL_user_vets = apiURL_vets + 'id/';

export const apiURL_sliders_vet = apiURL + apiVersion + 'sliders/images/vet/';

export const apiURL_vet_statistics = apiURL_vets + 'statistics/';

export const apiURL_user_profile_image_base64 = apiURL_user + 'profile_image_base64/';

export const apiURL_clinic_histories_image_base64 = apiURL_clinic_histories + 'image_base64/';

export const apiURL_auth = apiURL + apiVersion + 'auth/';

export const apiURL_password_request = apiURL_user + 'password_request/';

export const apiURL_locations = apiURL + apiVersion + 'locations/';

export const apiURL_locations_me = apiURL_locations + 'me/';

export const apiURL_location_states = apiURL_locations + '/states/';

export const apiURL_location_cities = apiURL_locations + '/cities/';

export const apiURL_chatlist = apiURL + apiVersion + 'listchats/';

export const apiURL_free_messages = apiURL + apiVersion + 'chat/';

export const apiURL_services_list = apiURL + apiVersion + 'services_types/';

export const apiURL_mp_check_expired = apiURL_user + 'mp_expiration_date/';