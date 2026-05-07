import systemMetrics from '../services/systemMetrics.service.js';

export const metricsMiddleware = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        systemMetrics.recordRequest(duration);

        if (res.statusCode >= 400) {
            systemMetrics.recordError();
        }
    });

    next();
};