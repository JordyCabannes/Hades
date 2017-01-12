/**
 * Created by Halim on 12/01/2017.
 */

export enum BackupCompress {
    GZIP = 0,
    LZO = 1
}

export class BackupModes {
    public static SNAPSHOT = 'snapshot';
    public static START = 'start';
    public static SUSPEND = 'suspend';
}

export interface ICreateContainerBackupRequest {
    vmid : number,
    storage : string,
    compress : BackupCompress,
    mode : string,
    starttime : string
}