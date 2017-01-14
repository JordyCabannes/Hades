import {IFrameselfAttribute} from "./frameself-attribute.interface";
import {IFrameselfEffector} from "./frameself-effector.interface";
/**
 * Created by Halim on 14/01/2017.
 */

export interface IFrameselfAction {
    id: string,
    category: string,
    name: string,
    attributes: [IFrameselfAttribute],
    priority: number,
    result: string,
    effector: IFrameselfEffector,
    timestamp: number,
    error: string,
    description: string
}