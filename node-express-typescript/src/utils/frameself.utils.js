"use strict";
/**
 * Created by Halim on 14/01/2017.
 */
class FrameselfUtils {
    static generateFrameselfEvent(category, data) {
        var frameselfEvent = {
            category: category,
            value: JSON.stringify(data),
            timestamp: +new Date(),
            expiry: null,
            priority: 0,
            severity: 0,
            description: null,
            reportTime: 0,
            reporterID: null,
            reporterLocation: null,
            sensor: null,
            location: null
        };
        return frameselfEvent;
    }
}
exports.FrameselfUtils = FrameselfUtils;
//# sourceMappingURL=frameself.utils.js.map