export class Ajax {
    get(url, callback, errorCallback) {
        this._sendRequest('GET', url, null, callback, errorCallback);
    }

    delete(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', url, true);
        xhr.onload = function() {
            let response = xhr.responseText;
            try {
                response = JSON.parse(response);
            } catch (e) {}
            callback(response, xhr.status);
        };
        xhr.onerror = function() {
            callback(null, xhr.status);
        };
        xhr.send();
    }


    post(url, data, callback, errorCallback) {
        this._sendRequest('POST', url, data, callback, errorCallback);
    }

    patch(url, data, callback, errorCallback) {
        this._sendRequest('PATCH', url, data, callback, errorCallback);
    }

    _sendRequest(method, url, data, callback, errorCallback) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        
        if (method !== 'GET') {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = xhr.responseText ? JSON.parse(xhr.responseText) : null;
                    callback(response, xhr.status);
                } catch (e) {
                    errorCallback?.({
                        status: xhr.status,
                        message: 'JSON parse error',
                        error: e
                    });
                }
            } else {
                errorCallback?.({
                    status: xhr.status,
                    message: xhr.statusText
                });
            }
        };

        xhr.onerror = () => {
            errorCallback?.({
                status: 0,
                message: 'Network error'
            });
        };

        xhr.send(data ? JSON.stringify(data) : null);
    }
    
}

export const ajax = new Ajax();