import {
	userDataLocalStorage,
	LOCAL_USER_TOKEN_KEY,
	localUserToken
} from './../models/constants'
import {configDataLocalStorage, USER_TYPE_GUEST_USER} from "../models/constants";
import APIService from "./../modules/ApiService";
import AsyncStorage from '@react-native-async-storage/async-storage';

import OneSignal from 'react-native-onesignal';

const mockedUserForTesting = {
	"id": 1,
	"email": "pepetest@yopmail.com",
	"name": "Pepe Test",
	"type": "client",
	"token": "token_client",
	"message": "Usuario logueado correctamente"
};

class AuthService {

	constructor() {
		this.api = new APIService();
	}

	async register(userData) {
		const loginResponse = await this.api.register(userData)
		  .then(res => {
			  console.log(res);
		  }).catch(err => {
			  console.log(err);
			  throw err;
		  });

		return loginResponse;
	}

	loginAsGuestUser() {
		const guestUser = {
			token: USER_TYPE_GUEST_USER
		};
		this.saveUserData(guestUser);
	}

	isGuestUser = async () => {
		try {
			const value = await AsyncStorage.getItem(userDataLocalStorage);
			const json = JSON.parse(value);
			return json && json.token && json.token === USER_TYPE_GUEST_USER;
		} catch (error) {
			console.log(error);
			return error;
			// Error retrieving data
		}
	};

	async login(userData) {
		/*this.saveUserData(mockedUserForTesting);
		return true;*/

		return new Promise((resolve, reject) => {
			this.api.login(userData)
			  .then(res => {
				  console.log(res);
				  this.saveUserData(res);
				  this.sendOneSignalTags(res);
				  resolve(res);
			  })
			  .catch(err => {
				  console.log(err);
				  reject(err);
			  });
		});
	}

	async updateUser(userData) {
		return new Promise((resolve, reject) => {
			this.api.updateUser(userData)
			  .then(res => {
				  console.log(res);
				  resolve(res);
			  })
			  .catch(err => {
				  console.log(err);
				  reject(err);
			  });
		});
	}

	async updateVetUser(userData) {
		return await this.api.updateVetUser(userData)
		  .then(res => {
			  return res.data;
		  }).catch(err => {
			  console.log(err);
			  throw err;
		  });
	}

	changePassword(obj) {
		return new Promise((resolve, reject) => {
			if (!obj || !obj.oldPassword || !obj.newPassword || !obj.newPasswordRepeated) {
				reject(new Error('obj no definido'));
			}

			if (obj.newPassword !== obj.newPasswordRepeated) {
				reject(new Error('Las contraseñas no coinciden'));
			}
			const userData = this.getUserData();

			this.login(userData.email, obj.oldPassword).then(() => {
				let data = {
					id: userData.id,
					password: obj.newPassword,
					name: userData.name
				};
				this.updateUser(data).then((res) => {
					resolve(res);
				}).catch((err) => {
					reject(err);
				});
			}).catch((err) => {
				reject(err);
			});
		});
	}

	logout() {
		AsyncStorage.clear((res) => {
			console.log(res);
		});
		this.clearTagsOneSignal();
	}

	loginLocalUser() {
		AsyncStorage.setItem(LOCAL_USER_TOKEN_KEY, localUserToken);
		/*const userData = {
			name: 'tu vieja',
			email: 'pepe@yopmail.com'
		};
		this.saveUserData(userData);*/
	}

	saveUserData(res) {
		console.log('saveUserData:');
		console.log(res);
		AsyncStorage.setItem(userDataLocalStorage, JSON.stringify(res));
	}

	getAndSaveRemoteConfigData() {
		return new Promise((resolve, reject) => {
			this.api.getConfig().then(res => {
				AsyncStorage.setItem(configDataLocalStorage, JSON.stringify(res.data));
				resolve(res.data);
			}).catch(err => {
				console.log(err);
				reject(err);
			})
		});
	};

	getLocalUserData = async () => {
		try {
			const value = await AsyncStorage.getItem(userDataLocalStorage);
			return JSON.parse(value);
		} catch (error) {
			console.log(error);
			return error;
			// Error retrieving data
		}
	};

	saveConfigData() {
		return new Promise((resolve, reject) => {
			this.api.getConfig().then(res => {
				AsyncStorage.setItem(configDataLocalStorage, JSON.stringify(res.data));
				resolve(res.data);
			}).catch(err => {
				console.log(err);
				reject(err);
			})
		});
	};

	getLocalConfigData = async () => {
		try {
			const value = await AsyncStorage.getItem(configDataLocalStorage);
			return JSON.parse(value);
		} catch (error) {
			console.log(error);
			return error;
			// Error retrieving data
		}
	};


	async getRemoteUserData() {
		return await this.api.getUserByMe()
		  .then(res => {
			  console.log(res);
			  return res;
		  })
		  .catch(err => {
			  console.log(err);
			  throw err;
		  });
	}

	async passwordRequest(email) {
		const pwdReqResponse = await this.api.passwordRequest(email)
		  .catch(err => {
			  console.log(err);
			  throw err;
		  });

		return pwdReqResponse;
	}

	checkLoginStatusAndDoSomethingOrDefault(doSomething, _default) {
		const userData = JSON.parse(AsyncStorage.getItem(userDataLocalStorage));
		userData && userData.token ? doSomething() : _default();
	}

	sendOneSignalTags(data) {
		// Sending multiple tags
		OneSignal.sendTags({user_id: data.id, user_type: data.type});
	}

	clearTagsOneSignal() {
		OneSignal.deleteTag("user_id");
		OneSignal.deleteTag("user_type");
	}
}

export default AuthService;