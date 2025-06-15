const express = require("express");
const router = express.Router();
const prisma = require("../utils/prisma/index.js")

const jwt = require("jsonwebtoken");
const SECRET_KEY="seoul";
const bcrypt = require("bcrypt")
const authenticateToken = require("../middleware/authentication-middleware");
const {signUpValidation, handleValidationResult, loginValidator} = require('../middleware/validation-result-handler.js')

//회원가입
router.post('/sign-up', signUpValidation, handleValidationResult, async(req, res, next)=>{
    console.log("가입 시도")
    const {email, password, nickname}=req.body;
    try{
        //검증
        const user = await prisma.users.findFirst({
            where:{email}
        })
        console.log(user);
        if(user){
            return next(new Error("ExistEmail"))
        }
        const saltRounds =10;
        const salt = await bcrypt.genSalt(saltRounds);
        console.log("salt : "+salt);

        const bcryptPassword = await bcrypt.hash(
            password, 
            salt
        )
        console.log("bcryptPassword : "+bcryptPassword);

        //db저장
        await prisma.users.create({
            data:{
                email, 
                password: bcryptPassword, 
                nickname
            }
        })
        return res.status(201).json({
            msg:"회원가입 완료"
        })
    }catch(e){
        console.log(e)
        return next(new Error("DataBaseError"))
    }
})

//로그인
router.post('/login', loginValidator, handleValidationResult, async (req, res, next)=>{
    const {email, password}= req.body;
    const user = await prisma.users.findUnique({
        where:{email}
    })
    if(!user){
        return next(new Error("UserNotFound"))
    }
    //비번 검증
    const verifyPassword = await bcrypt.compare(password, user.password)
    console.log(verifyPassword)
    if(!verifyPassword){
        return next(new Error("passwordError"))
    }
    const token = jwt.sign({
        userId: user.userId
    }, SECRET_KEY, {
        expiresIn:"12h"
    })
    return res.status(200).send({
        token
    })
})

//전체 조회
router.get('/users', async(req, res, next)=>{
    try{
        const users = await prisma.users.findMany({
            select:{
                userId:true, 
                email:true, 
                nickname:true, 
                createdAt:true
            },
            orderBy:{
                createdAt:'desc'
            },
        })
        return res.status(200).json({data:users});
    }catch(error){
        next(error);
    }
});

//특정 사용자 조회
router.get('/users/:userId', async(req,res, next)=>{
    try{
        const {userId } = req.params
        const user = await prisma.users.findUnique({
            where:{userId:+userId},
            // include:{
            //     Post:{
            //         select:{
            //             postId:true,
            //             title:true, 
            //             createdAt:true, 
            //         }, 
            //         orderBy:{
            //             createdAt:'desc',
            //         },
            //     },
            // },
        })
        if(!user){
            return next(new Error("UserNotFound"))
        }
        const {password :_, ...userData}=user;
        return res.status(200).json({data:userData});
    }catch(error){
        next(error);
    }
})

//정보 수정
router.put('/users/:userId', async(req,res, next)=>{
    try{
        const {userId} = req.params;
        const {email, password, newPassword, nickname} =req.body;

        const user = await prisma.users.findUnique({
            where:{userId:+userId},
        })
        if(!user){
            return next(new Error("UserNotFound"))
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return next(new Error("passwordError"));
        }

        let updatedPassword = user.password;
        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            updatedPassword = await bcrypt.hash(newPassword, salt);
        }

        await prisma.users.update({
            where:{userId:+userId},
            data:{
                email : email||user.email,
                password : updatedPassword,
                nickname : nickname||user.nickname,
                updatedAt : new Date(),
            }
        })
        return res.status(200).json({ message: '사용자 정보가 성공적으로 수정되었습니다.' });
    }catch(error){
        console.log(error)
        next(error)
    }
});

//사용자 삭제
router.delete('/users/:userId', async (req, res, next)=>{
    try{
        const {userId} = req.params;
        const {password} = req.body;
        
        const user = await prisma.users.findUnique({
            where:{userId:+userId},
        })
        if(!user){
            return next(new Error("UserNotFound"))
        }
       const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return next(new Error("passwordError"));
        }

        await prisma.users.delete({
            where:{userId:+userId}
        });
         return res.status(200).json({ message: '사용자 정보가 성공적으로 삭제되었습니다.' });
    }catch (error) {
    next(error);
  }
})
module.exports = router;


