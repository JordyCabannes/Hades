import {ICreateLxcContainerRequest} from "../interfaces/create-lxc-container-request.interface";
import {IFrameselfEvent} from "../interfaces/frameself-event.interface";
/**
 * Created by Halim on 14/01/2017.
 */

export class FrameselfUtils {

    public static generateFrameselfEvent(category : string, data : {[id:string]:any;}) : IFrameselfEvent
    {
        var frameselfEvent : IFrameselfEvent = {
            category:category,
            value:JSON.stringify(data),
            timestamp:+new Date(),
            expiry:null,
            priority:0,
            severity:0,
            description:null,
            reportTime:0,
            reporterID:null,
            reporterLocation:null,
            sensor:null,
            location:null
        }

        return frameselfEvent;
    }
}