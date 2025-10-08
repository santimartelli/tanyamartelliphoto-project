// app/middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: 'Demasiados intentos desde esta IP, vuelve a probar en 15 minutos',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const formSubmissionRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 6, // limit each IP
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            message: 'Has enviado demasiadas solicitudes en poco tiempo. Inténtalo de nuevo en unos minutos.'
        });
    }
});

module.exports = { loginRateLimiter, formSubmissionRateLimiter };
