const hasadminAccess = (req,res,next)=> {
    if(req.session.adminInfo == null) {
        res.redirect("/user/login");
    }
    else {
        next();
    }
}

module.exports=hasadminAccess;