
import { NgfmConnector } from "../../..";
import { Request } from 'express';

export default function (connector: NgfmConnector) {
    return function (req: Request | any, res, next) {
        connector.ls(connector.store.getFullPath(req.path)).then(
            data => res.json(data),
            error => next(error)
        );
    }
}