const get_dashboard = function (req,res,next){ // can be used a middleware to cheking process
    if(req.session.isAuth && req.session.user && req.session.user.role === 'admin'){
        res.render('dashboard'/* ,{role: req.session.user.role} */);
    }
    else{
        res.redirect('/blogs');
    }
};

module.exports = {
    get_dashboard
}