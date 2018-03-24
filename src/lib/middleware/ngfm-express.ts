//import express, { Router } from 'express'
const express = require('express');
import { NgfmConnector } from '../connectors/ngfm-connector';
import * as multipart from 'connect-multiparty';
import { NgfmExpressConfig } from './ngfm-express.config';
import { NGFM_VERBS } from './verbs/index';
export class NgfmExpress {
    public express;

    constructor(public connector: NgfmConnector, protected config?: NgfmExpressConfig) {
        this.express = express();
    }
    public get router() {
        const router = express.Router();
        router
            .head('/**', NGFM_VERBS.head(this.connector))
            .get('/**', NGFM_VERBS.get(this.connector))
            .post('/**', multipart(), NGFM_VERBS.post(this.connector))
            .delete('/**', NGFM_VERBS.delete(this.connector));
        if (this.config && this.config.serveStatic) {
            router.get('/**', express.static(this.config.serveStatic));
        }
        router.use((error, req, res, next) => {
            res.status(400).json(typeof error === 'object' ? error : { error });
        });
        return router;
    }

}