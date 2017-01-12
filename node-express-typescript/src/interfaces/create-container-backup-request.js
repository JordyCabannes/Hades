/**
 * Created by Halim on 12/01/2017.
 */
"use strict";
var BackupCompress;
(function (BackupCompress) {
    BackupCompress[BackupCompress["GZIP"] = 0] = "GZIP";
    BackupCompress[BackupCompress["LZO"] = 1] = "LZO";
})(BackupCompress = exports.BackupCompress || (exports.BackupCompress = {}));
class BackupModes {
}
BackupModes.SNAPSHOT = 'snapshot';
BackupModes.START = 'start';
BackupModes.SUSPEND = 'suspend';
exports.BackupModes = BackupModes;
//# sourceMappingURL=create-container-backup-request.js.map