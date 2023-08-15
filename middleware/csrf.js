module.exports = (req,res,next) =>{
    console.log("the csrf inside csrf is "+req.session.token);
    res.locals.csrfToken = req.csrfToken();
    next(); 
}