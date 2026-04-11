

export function handleError(err,req,res,next){
    const response={
        message:err.message || 'Internal Server Error!!!'
    }

    if(process.env.ENV ==="development"){
        response.status=err.status;
    }

    res.status(err.status || 500).json(response);
}