import { Request, Response, NextFunction } from 'express';
import PrettyError from 'pretty-error';

class PrettyErrorMiddleware {
    private pe: PrettyError;

    constructor() {
        this.pe = new PrettyError();
        this.pe.start();
    }

    handle(err: Error, req: Request, res: Response, next: NextFunction) {
        
        const statusCode = res.statusCode || 500;
        if (statusCode >= 400 && statusCode < 600) {
            const formattedError = this.pe.render(err);
            let errorMessage = '';
            if (statusCode >= 500 && statusCode < 600) {
                errorMessage = 'An internal server error occurred.';
            } else if (statusCode >= 400 && statusCode < 500) {
                errorMessage = 'A client error occurred.';
            }

            const fullErrorMessage = `${errorMessage}\n\n${formattedError}`;
            res.status(statusCode).send(fullErrorMessage);
        } else {
            next(err);
        }
    }
}

export default PrettyErrorMiddleware;
