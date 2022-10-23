export function unauthorized(res){
    console.log("403 ok")
    return res.status(403).json({ message: 'Unauthorized' })
}

export function unauthenticated(res){
    console.log("401 ok")
    return res.status(401).json({ message: 'Unauthenticated' })
}

export function ok(res){
    console.log("200 ok")
    return res.status(200).json({ message: 'Authenticated and authorised' })
}