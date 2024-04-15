function authRole(...allowedRoles) {
    return (req, res, next) => {
        const roles = [...allowedRoles];
        const result = roles.includes(req.user.role);
        if (!result) {
            res.status(401)
            return res.send('Not allowed')
        }

        next()
    }
}

module.exports = authRole;