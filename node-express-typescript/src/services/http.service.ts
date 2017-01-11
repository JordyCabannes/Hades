/**
 * Created by Halim on 09/01/2017.
 */

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //desactive la verification de certificat en https

export class HttpService
{
    private httpClient;
    private endpoint : string;
    private permanentHeaders : {[id:string]:any;};
    private permanentCookie : {[id:string]:any;};

    constructor(endpoint : string, permanentHeaders?:{[id:string]:any;}, permanentCookie?:{[id:string]:any;})
    {
        this.httpClient = require('requestify');
        this.endpoint = endpoint;
        this.permanentHeaders = permanentHeaders;
        this.permanentCookie = permanentCookie;
    }

    private errorHandler = function(error)  {
        console.error('\n/!\\ ERROR: \n', error, '\n/!\\ ERROR: \n');
        return error; //null = valeur prise par le retour de la promise si il y a une erreur lors de la requete http
    }

    private prepareFormUrlEncodedRequest(httpVerb : string, data?: {[id:string]:any;}) : {[id:string]:any;}
    {
        var formUrlEncodedRequest = {
            method: httpVerb,
            dataType:'form-url-encoded'
        };

        if(data !== undefined)
            formUrlEncodedRequest['body'] = data;

        if(this.permanentHeaders !== undefined)
            formUrlEncodedRequest['headers'] = this.permanentHeaders;

        if(this.permanentCookie !== undefined)
            formUrlEncodedRequest['cookies'] = this.permanentCookie;

        return formUrlEncodedRequest;
    }

    public get (url : string)
    {
        var finalUrl : string = this.endpoint + url;
        var formUrlEncodedRequest = this.prepareFormUrlEncodedRequest('GET');
        var promise = this.httpClient.request(finalUrl, formUrlEncodedRequest).catch(this.errorHandler);
        return promise;
    }

    public post(url : string, data : {[id:string]:any;})
    {
        var finalUrl : string = this.endpoint + url;
        var formUrlEncodedRequest = this.prepareFormUrlEncodedRequest('POST', data);
        var promise = this.httpClient.request(finalUrl, formUrlEncodedRequest).catch(this.errorHandler);
        return promise;
    }


    public put(url : string, data : {[id:string]:any;})
    {
        var finalUrl : string = this.endpoint + url;
        var formUrlEncodedRequest = this.prepareFormUrlEncodedRequest('PUT', data);
        var promise = this.httpClient.request(finalUrl, formUrlEncodedRequest).catch(this.errorHandler);
        return promise;
    }

    public delete(url : string, data? : {[id:string]:any;}) : Promise<{[id:string]:any;}>
    {
        var finalUrl : string = this.endpoint + url;
        var formUrlEncodedRequest = this.prepareFormUrlEncodedRequest('DELETE', data)
        var promise = this.httpClient.request(finalUrl, formUrlEncodedRequest).catch(this.errorHandler);
        return promise;
    }

}