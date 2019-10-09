const Redis = require('ioredis');
const client = new Redis();

const possibleKeys = [ 'firstname', 'lastname', 'email', 'pseudo', 'password' ];
const formuser = 'user:'
// set: Set the string value of a key

module.exports = {
	async get(userId) {
		return await client.get(formuser + userId, function(_err, res) {
			return res;
		});
	},

	async count() {
		return await // keys: Find all keys matching the given pattern

		client.keys(formuser, function(_err, res) {
			return res;
		});
	},

	getAll() {
		// hgetall: Get all the fields and values in a hash

		return client.hgetall(formuser, function(_err, res) {
			return res;
		});
	},

	insert(params) {
		userId = params[userId];
		delete params[userId];

		if (
			Object.keys(params).length === possibleKeys.length &&
			Object.keys(params).every((element) => {
				possibleKeys.includes(element);
			})
		) {
			// hset: Set the string value of a hash field
            return await client.hset(formuser + userId, params, function(_err, res) {
				return res;
			});
		} else {
			let err = new Error('Bad Request');
			err.status = 400;
			return Promise.reject(err);
		}
    },
    
    update(userId, params){
        // hset: Set the string value of a hash field
        if (
			Object.keys(params).length === possibleKeys.length &&
			Object.keys(params).every((element) => {
				possibleKeys.includes(element);
			})
		) {
            return await client.hset(formuser+userId, params, function (_err, res) {
                return res
            });
        } else {
            let err = new Error('Bad Request');
			err.status = 400;
			return Promise.reject(err);
        }
    },

    remove(userId){
        // del: Delete a key
        
        return await client.del(formuser+userId, function (_err, res) {
            return res
        });
    }
};
