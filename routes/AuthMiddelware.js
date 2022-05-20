// laget middelware som sjekker rollene
module.exports.isUser = (req, res, next)=>{
    if(req.isAuthenticated()){
        next()
    } else{
        res.status(401).json({msg:"du må være logget inn for dette"})
    }
}

module.exports.isRoot = (req, res, next)=>{
    if(this.isUser && req.user.rootMember){
        next()
    } else{
        res.status(401).json({msg:"du må være Root medlem for å se dette"})
    }
}

module.exports.isEditor = (req, res, next) => {
    if(this.isUser && req.user.editor){
        next()
    } else{
        res.status(401).json({msg:"du må være editor for denne handlingen"})
    }
}

module.exports.isAdmin = (req, res, next) => {
    if(this.isUser && req.user.admin){
        next()
    } else{
        res.status(401).json({msg:"du må være admin får å se dette"})
    }
}