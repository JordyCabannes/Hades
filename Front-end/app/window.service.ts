import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class WindowService {
    constructor() {}

    getNativeWindow() {
        return window;
    }
}