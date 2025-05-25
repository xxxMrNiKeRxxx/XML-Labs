export class Ajax {
    async get(url, callback, errorCallback) {
        await this._sendRequest('GET', url, null, callback, errorCallback);
    }

    async delete(url, callback, errorCallback) {
        await this._sendRequest('DELETE', url, null, callback, errorCallback);
    }

    async post(url, data, callback, errorCallback) {
        await this._sendRequest('POST', url, data, callback, errorCallback);
    }

    async patch(url, data, callback, errorCallback) {
        await this._sendRequest('PATCH', url, data, callback, errorCallback);
    }

    async _sendRequest(method, url, data, callback, errorCallback) {
        try {
            const options = {
                method: method,
                headers: {}
            };

            if (method !== 'GET') {
                options.headers['Content-Type'] = 'application/json';
                if (data) {
                    options.body = JSON.stringify(data);
                }
            }

            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw {
                    status: response.status,
                    message: response.statusText
                };
            }

            try {
                const responseData = response.status !== 204 ? await response.json() : null;
                callback?.(responseData, response.status);
            } catch (e) {
                throw {
                    status: response.status,
                    message: 'JSON parse error',
                    error: e
                };
            }
        } catch (error) {
            errorCallback?.({
                status: error.status || 0,
                message: error.message || 'Network error',
                error: error.error
            });
        }
    }
}

export const ajax = new Ajax();