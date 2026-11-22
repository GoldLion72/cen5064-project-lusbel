import { tokenService } from '../services/index.js';
import { readAuthCookie } from '../controllers/authCookie.js';

// Authentication only: verifies the token cookie and exposes the user as req.user.
// Controllers stay unaware of how the user was authenticated.
function createRequireAuth(tokens) {
    return function requireAuth(req, res, next) {
        const payload = tokens.verify(readAuthCookie(req));

        if(!payload?.sub) {
            res.status(401).json({success: false, message: "Not logged in.", data: {}});
            return;
        }

        req.user = {id: payload.sub, email: payload.email};
        next();
    };
}

const requireAuth = createRequireAuth(tokenService);

export {createRequireAuth};
export default requireAuth;
