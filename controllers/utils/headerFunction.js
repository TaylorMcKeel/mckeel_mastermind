const checkHeader =(req, isNew)=>{
  const header = req.headers('Bearer')
  if(!header && isNew){
     header = req.game._id
     return header
  }else if(!header){
    throw new Error('You are not authorized for this action')
  } else{
    return header
  }
}