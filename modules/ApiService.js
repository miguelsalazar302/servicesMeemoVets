import {
    apiURL_password_request,
    apiURL_auth,
    apiURL_user,
    apiURL_user_me,
    apiURL_user_profile_image_base64,
    apiURL_professional_registration_institutes,
    apiURL_registrations_purposes,
    apiURL_schedules,
    apiURL_vets,
    apiURL_sliders_vet,
    apiURL_user_vets,
	apiURL_config,
    apiURL_bookings,
    apiURL_chatlist,
    apiURL_free_messages, 
    apiURL_services_list,
    apiURL_mp_check_expired, apiURL_services
}
    from "./../models/api-urls";

// import unregister from './../modules/ApiService.config'; // No estamos usando el register(), pero importarlo hace que funcione el interceptor

import axiosInstance from './../modules/ApiService.interceptor';
import AuthService from './../modules/AuthService'
import {
	apiURL_clinic_histories, apiURL_clinic_histories_image_base64,
	apiURL_locations,
	apiURL_messages,
	apiURL_mp_authorize,
	apiURL_mp_check_authorization,
	apiURL_pet_owners_me,
	apiURL_pets,
	apiURL_pets_adjectives, apiURL_pets_diets,
	apiURL_pets_genders, apiURL_pets_habits, apiURL_pets_sizes,
	apiURL_pets_types, apiURL_races,
	apiURL_schedules_me,
	apiURL_specialties, apiURL_vaccines, apiURL_vet_statistics
} from "../models/api-urls";
import { USER_TYPE_VET } from "../models/constants";

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

class APIService {

    register = async(userData) => {
        const response = await fetch(apiURL_user, {
            method: 'POST',
            headers,
            body: JSON.stringify(userData)
        });

        const body = await response.json();

        if (response.status >= 300) throw new Error(body.message);

        return body;
    };

    getConfig = async() => {
        const response = await axiosInstance.get(apiURL_config);
        return response.data;
    };

    checkMercadoPagoAuthorizationStatus = async() => {
        const response = await axiosInstance.get(apiURL_mp_check_authorization);
        return response.data;
    };

    getMercadoPagoAuthorization = async() => {
        const response = await axiosInstance.get(apiURL_mp_authorize);
        return response.data;
    };

    getVetSlider = async() => {
        const response = await axiosInstance.get(apiURL_sliders_vet);
        return response.data;
    };

	getVetStatistics = async(vetId, from, to) => {
        const response = await axiosInstance.get(apiURL_vet_statistics + vetId , {
	        params: {
		        from: from,
		        to: to,
	        }
        });
        return response.data;
    };

    getUserById = async(id) => {
        const response = await axiosInstance.get(apiURL_user + id);
        return response.data;
    };

    getUserByMe = async() => {
        const response = await axiosInstance.get(apiURL_user_me);
        return response.data;
    };

    getVetByUserId = async(userId) => {
        const response = await axiosInstance.get(apiURL_vets + 'id/' + userId);
        return response.data;
    };

    getServiceByUserId = async(userId) => {
        const response = await axiosInstance.get(apiURL_services + 'id/' + userId);
        return response.data;
    };

    getProfessionalRegistrationInstitutes = async() => {
        const response = await axiosInstance.get(apiURL_professional_registration_institutes);
        return response.data;
    };

    getRegistrationsPurposes = async() => {
        const response = await axiosInstance.get(apiURL_registrations_purposes);
        return response.data;
    };

    getSpecialties = async() => {
        const response = await axiosInstance.get(apiURL_specialties);
        return response.data;
    };

	getPetRaces = async(pet_type_id) => {
		const response = await axiosInstance.get(apiURL_races + '?pet_type_id=' + pet_type_id);
		return response.data;
	};

	getPetVaccines = async(pet_type_id) => {
		const response = await axiosInstance.get(apiURL_vaccines + '?pet_type_id=' + pet_type_id);
		return response.data;
	};

    getMySchedules = async() => {
        const response = await axiosInstance.get(apiURL_schedules_me);
        return response.data;
    };

	getMyPetOwners = async() => {
        const response = await axiosInstance.get(apiURL_pet_owners_me);
        return response.data;
    };

    getMyBookingsByStatus = async(status) => {
        const response = await axiosInstance.get(apiURL_bookings + 'me/?status=' + status);
        return response.data;
    };

	getPetTypes = async() => {
		const response = await axiosInstance.get(apiURL_pets_types);
		return response.data;
	};

	getPet = async(petId) => {
		const response = await axiosInstance.get(apiURL_pets + petId);
		return response.data;
	};

	getPetAdjectives = async() => {
		const response = await axiosInstance.get(apiURL_pets_adjectives);
		return response.data;
	};

	getPetGenders = async() => {
		const response = await axiosInstance.get(apiURL_pets_genders);
		return response.data;
	};

	getPetDiets = async() => {
		const response = await axiosInstance.get(apiURL_pets_diets);
		return response.data;
	};

	getPetHabits = async() => {
		const response = await axiosInstance.get(apiURL_pets_habits);
		return response.data;
	};

	getPetSizes = async(petTypeId) => {
		const response = await axiosInstance.get(`${apiURL_pets_sizes}?pet_type_id=${petTypeId}`);
		return response.data;
	};

	getPetsByOwnerId = async(petOwnerId) => {
		const response = await axiosInstance.get(`${apiURL_pets}?pet_owner_id=${petOwnerId}`);
		return response.data;
	};

    getMessages = async(bookingId) => {
        const response = await axiosInstance.get(apiURL_messages + '?booking_id=' + bookingId);
        // const response = await axiosInstance.get('http://192.168.0.14:9001/v1/messages?booking_id=' + bookingId);
        return response.data;
    };

    postMessage = async(message, bookingId) => {
	    const data = {
		    msg: message,
		    booking_id: bookingId
	    };

	    const response = await axiosInstance.post(apiURL_messages, data);
        // const response = await axiosInstance.post('http://192.168.0.14:9001/v1/messages/', data);
        return response.data;
    };

    updateUser = async(userData) => {
	    const response = await axiosInstance.put(apiURL_user_me, userData);
        return response.data;
    };

    updateVetUser = async(vetData) => {
        return await axiosInstance.put(apiURL_user_vets + vetData.id, vetData);
    };

    updateProfileImage = async(base64) => {
        return await axiosInstance.post(apiURL_user_profile_image_base64, {
            'profile_image': base64
        });
    };

    updateHistoryClinicImage = async(clinicHistoryId, base64) => {
        return await axiosInstance.post(apiURL_clinic_histories_image_base64, {
        	'clinic_history_id': clinicHistoryId,
            'image': base64
        });
    };

    getScheduleById = async(scheduleId) => {
        const response = await axiosInstance.get(apiURL_schedules + scheduleId);
        return response.data;
    };

    postSchedule = async(scheduleData) => {
        return axiosInstance.post(apiURL_schedules, scheduleData);
    };

	getBookingById = async(bookingId) => {
		const response = await axiosInstance.get(apiURL_bookings + bookingId);
		return response.data;
	};

	postBooking = async(bookingData) => {
		const response = await axiosInstance.post(apiURL_bookings, bookingData);
		return response.data;
	};


	putBooking = async(bookingData) => {
		const response = await axiosInstance.put(apiURL_bookings, bookingData);
		return response.data;
	};

	postClinicHistory = async(data) => {
		const response = await axiosInstance.post(apiURL_clinic_histories, data);
		return response.data;
    };
    
    putClinicHistory = async(data) => {
		const response = await axiosInstance.put(apiURL_clinic_histories, data);
		return response.data;
	};

	getClinicHistoriesByPetId = async(petId) => {
		const response = await axiosInstance.get(apiURL_clinic_histories + '?pet_id=' + petId);
		return response.data;
	};

	getClinicHistoriesByBookingId = async(bookingId) => {
		const response = await axiosInstance.get(apiURL_clinic_histories + '?booking_id=' + bookingId);
		return response.data;
	};

    putSchedule = async(scheduleData, scheduleId) => {
        return await axiosInstance.put(apiURL_schedules + scheduleId, scheduleData);
    };

	getLocationById = async(locationId) => {
		const response = await axiosInstance.get(apiURL_locations + locationId);
		return response.data;
	};

    passwordRequest = async(email) => {
        const response = await fetch(apiURL_password_request, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                email,
            })
        });

        const body = await response.json();

        if (response.status >= 300) throw new Error(body.message);

        return body;
    };

    login = (userData) => {
        return fetch(apiURL_auth, {
            method: 'POST',
            headers,
            body: JSON.stringify(userData)
        })
            .then((res) => {
                console.log(res);
                if (res.status >= 300) {
                    throw new Error(res);
                }
                return res.json();
            })
            .catch((err) => {
                console.log(err.message);
                throw new Error('Usuario o contraseña incorrecta');
            })
    };

    getFreeMessages = async(chatId) => {
		const response = await axiosInstance.get(apiURL_free_messages + '?chat_id=' + chatId);
		return response.data;
	};

	postFreeMessage = async(message, chatId, clienteId, vetId) => {
		const data = {
			msg: message,
            chat_id: chatId,
            cliente_id: clienteId,
            vet_id: vetId,
        };
        //alert(JSON.stringify(data))

		const response = await axiosInstance.post(apiURL_free_messages, data);
		return response.data;
    };

    getChats = async(user_id) => {
        const response = await axiosInstance.get(apiURL_chatlist + '?user_id=' + user_id + '&user_type=vet');
		return response.data;
    };

    getServicesList = async() => {
        const response = await axiosInstance.get(apiURL_services_list);
		return response.data;
    };

    getMPExpireDate = async() => {
        const response = await axiosInstance.get(apiURL_mp_check_expired);
        return response.data;
    };

}

//unregister();

export default APIService;