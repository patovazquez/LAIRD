module.exports = (req,res,next) =>{
    
    if(!req.session.email){
        res.redirect('/');
    }else if (req.session.ligaId != req.params.id) {
        res.redirect('/');
    } else {
        next();
    }



}