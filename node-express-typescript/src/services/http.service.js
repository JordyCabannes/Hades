/**
 * Created by Halim on 09/01/2017.
 */
"use strict";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //desactive la verification de certificat en https
class HttpService {
    constructor(endpoint, permanentHeaders, permanentCookie) {
        this.errorHandler = function (error) {
            console.error('\n/!\\ ERROR: \n', error, '\n/!\\ ERROR: \n');
            return error; //null = valeur prise par le retour de la promise si il y a une erreur lors de la requete http
        };
        this.httpClient = require('requestify');
        this.endpoint = endpoint;
        this.permanentHeaders = permanentHeaders;
        this.permanentCookie = permanentCookie;
    }
    prepareFormUrlEncodedRequest(httpVerb, data) {
        var formUrlEncodedRequest = {
            method: httpVerb,
            dataType: 'form-url-encoded'
        };
        if (data !== undefined)
            formUrlEncodedRequest['body'] = data;
        if (this.permanentHeaders !== undefined)
            formUrlEncodedRequest['headers'] = this.permanentHeaders;
        if (this.permanentCookie !== undefined)
            formUrlEncodedRequest['cookies'] = this.permanentCookie;
        return formUrlEncodedRequest;
    }
    get(url) {
        var finalUrl = this.endpoint + url;
        var formUrlEncodedRequest = this.prepareFormUrlEncodedRequest('GET');
        var promise = this.httpClient.request(finalUrl, formUrlEncodedRequest).catch(this.errorHandler);
        return promise;
    }
    post(url, data) {
        var finalUrl = this.endpoint + url;
        var formUrlEncodedRequest = this.prepareFormUrlEncodedRequest('POST', data);
        var promise = this.httpClient.request(finalUrl, formUrlEncodedRequest).catch(this.errorHandler);
        return promise;
    }
    put(url, data) {
        var finalUrl = this.endpoint + url;
        var formUrlEncodedRequest = this.prepareFormUrlEncodedRequest('PUT', data);
        var promise = this.httpClient.request(finalUrl, formUrlEncodedRequest).catch(this.errorHandler);
        return promise;
    }
    delete(url, data) {
        var finalUrl = this.endpoint + url;
        var formUrlEncodedRequest = this.prepareFormUrlEncodedRequest('DELETE', data);
        var promise = this.httpClient.request(finalUrl, formUrlEncodedRequest).catch(this.errorHandler);
        return promise;
    }
}
exports.HttpService = HttpService;
//# sourceMappingURL=http.service.js.map