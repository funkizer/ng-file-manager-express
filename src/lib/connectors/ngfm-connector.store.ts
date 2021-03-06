const sha256 = require('sha256');
import * as pathLib from 'path';
import { NgfmConnectorConfig } from './ngfm-connector.config';
import { Request } from 'express';
export class NgfmConnectorStore {
    private hashExpiresIn = 5 * 60 * 1000;
    private _hashMap: Map<string, string> = new Map();
    constructor(private config: NgfmConnectorConfig) { }
    /**
     * Unique hash for a path. Can be used eg. to move a file or folder. Expires in a few minutes.
     */
    getHash(path: string) {
        const fullPath = this.getFullPath(path);
        const hash = sha256(`${fullPath}.${new Date().getTime()}.${Math.round(Math.random() * 9999999)}`);
        this._hashMap.set(hash, fullPath);
        setTimeout(() => this._hashMap.delete(hash), this.hashExpiresIn);
        return hash;
    }
    /**
     * Get the file or folder path for a hash.
     */
    getPathForHash(hash: string) {
        return this._hashMap.get(hash);
    }
    /**
     * Absolute folder/file path in relation to the root of the connector.
     * Works the same as path.join('a','b','c...'), ie. pass as many path fragments as needed.
     */
    getFullPath(...args) {
        return decodeURI(pathLib.join(this.config.root, ...args));
    }
    /**
     * Full public url of a request
     */
    getPublicUrl(req: Request) {
        return (this.config.absoluteUrls !== false ? req.protocol + '://' + req.get('host') : '') + pathLib.join(req.baseUrl, req.path).replace(/\\/g, '/');
    }
}