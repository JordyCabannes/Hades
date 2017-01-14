/**
 * Created by Halim on 14/01/2017.
 */
"use strict";
class ProxmoxApiUtils {
    static nth_occurrence(string, char, nth) {
        var first_index = string.indexOf(char);
        var length_up_to_first_index = first_index + 1;
        if (nth == 1) {
            return first_index;
        }
        else {
            var string_after_first_occurrence = string.slice(length_up_to_first_index);
            var next_occurrence = ProxmoxApiUtils.nth_occurrence(string_after_first_occurrence, char, nth - 1);
            if (next_occurrence === -1) {
                return -1;
            }
            else {
                return length_up_to_first_index + next_occurrence;
            }
        }
    }
    static leftPad(number, targetLength) {
        var output = number + '';
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return output;
    }
}
exports.ProxmoxApiUtils = ProxmoxApiUtils;
//# sourceMappingURL=proxmox-api.utils.js.map