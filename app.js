const express = require('express');
const app = express();
const PORT = 4000;

const db = require('./models'); 
// models/index.js를 통해 연결된 Sequelize 인스턴스와 모델들을 가져옴
app.use(express.json());


async function testDbConnection() {
  try {
    await db.sequelize.authenticate();
    console.log('데이터베이스 연결 성공!');
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error);
  }
}

testDbConnection();

//모든 사용자 조회
app.get('/users', async(req, res)=>{
  try{
    const users = await db.User.findAll();
    res.json(users);
  }catch(error){
    console.log('모든 사용자 조회 실패', error);
    res.status(500).json({error:'서버 오류: 사용자 조회 실패'})
  }
})

//특정 사용자 조회
app.get('/users/:id', async(req, res)=>{
  console.log("요청 바디: ", req.body);
  try{
    const user = await db.User.findByPk(req.params.id);
    if(!user){
      return res.status(400).json({error:'사용자를 찾을 수 없습니다.'})
    }
    res.json(user);
  }catch(error){
    console.log(`ID${req.params.id}사용자 조회 실패:`, error);
    res.status(500).json({error:'서버 오류:사용자조회 실패'});
  }
})

//사용자 추가
app.post('/users', async(req, res)=>{
  const{email, username}=req.body;
  if(!email||!username){
    return res.status(400).json({error:'필수 항목 확인'})
  }try{
    const newUser= await db.User.create({email, username})
    res.status(201).json(newUser);
  }catch(error){
     console.error('사용자 생성 중 에러:', error);
    if(error.name ==='SequelizeUniqueConstraintError'){
      return res.status(409).json({error:'이미 존재하는 이메일입니다.'});
    }
    res.status(500).json({error:'서버 오류:사용자 생성 실패'})
  }
})

//사용자 정보 수정
app.put('/users/:id', async(req, res)=>{
  const{email, username}=req.body;
  const userId = req.params.id;

  try{
    const user = await db.User.findByPk(userId);
    if(!user){
      return res.status(404).json({error:'사용자를 찾을 수 없습니다.'});
    }
    await user.update({
      email: email ||user.email, 
      username: username||user.username
    })
    res.json(user);
  }catch(error){
    console.error(`ID ${userId}사용자 업데이트 실패`, error);
    res.status(500).json({error:'서버오류:사용자 업데이트 실패'})
  }
});

//삭제
app.delete('/users/:id', async(req, res)=>{
  const userId = req.params.id;
  try{
    const deletedRowCount = await db.User.destroy({
      where: {id:userId}
    })
    if(deletedRowCount===0){
      return res.status(404).json({error:'사용자를 찾을 수 없습니다.'})
    }
    res.status(204).send();
  }catch(error){
    console.error(`ID ${userId} 사용자 삭제 실패:` ,error);
    res.status(500).json({error:'서버 오류 :사용자 삭제 실패'})
  }
});

//유저 게시글 조회
app.get('/users/:id/posts', async(req, res)=>{
  try{
     const posts = await db.Post.findAll({
        where: { userId: req.params.id },
        attributes :['id', 'title', 'content'], 
     });
  if(posts.length===0){
    return res.status(404).json({error:'사용자의 게시글을 찾을 수 없습니다.'})
  }
    res.json(posts); //게시글 반환
  }catch(error){
    console.error(`ID ${req.params.id} 사용자의 글 조회 실패`, error);
    res.status(500).json({error:'서버 오류: 게시글 조회실패'})
  }
})

//전체 게시글 조회
app.get('/posts', async(req, res)=>{
  try{
    const posts = await db.Post.findAll();
    res.json(posts);
  }catch(error){
    console.error('모든 게시글 조회 실패', error);
    res.status(500).json({error:'서버 오류: 게시글 조회실패'})
  }
});

//특정 게시글 조회
app.get('/posts/:id', async(req, res)=>{
  try{
    const post = await db.Post.findByPk(req.params.id);
    if(!post){
      return res.status(404).json({error:'게시글을 찾을 수 없습니다.'});
    }
    res.json(post);
  }catch(error){
    console.error(`ID${req.params.id}게시글 조회 실패`, error);
    res.status(500).json({error:'서버 오류: 게시글 조회실패'})
  }
});

//게시글 생성
app.post('/posts', async(req, res)=>{
  const {title, content, userId}=req.body;
  if(!title||!content||!userId){
    return res.status(400).json({error:'필수항목 확인 바랍니다.'})
  }try{
    const newPost = await db.Post.create({title, content, userId});
    res.status(201).json(newPost);
  }catch(error){
    console.error('게시글 등록 실패', error);
    if(error.name === 'SequelizeUniqueConstraintError'){
      return res.status(409).json({error:'게시글을 등록할 수 없습니다.'});
    }
    res.status(500).json({error:'서버오류: 게시글 등록 실패'});
  }
})
//게시글 수정
app.put('/posts/:id', async(req, res)=>{
  const {title, content}=req.body;
  const id = req.params.id
  try{
    const post = await db.Post.findByPk(id);
    if(!post){
      return res.status(404).json({error:'게시글을 찾을 수 없습니다.'})
    }
    await post.update({
      title: title||post.title, 
      content: content||post.content
    });
    res.json(post);
  }catch(error){
    console.error(`ID ${id}번 글을 수정 실패했습니다.`, error);
    res.status(500).json({error:'서버오류: 게시글 수정 실패'})
  }
})
//게시글 삭제
app.delete('/posts/:id', async(req, res)=>{
  const id = req.params.id;

  try{
    const deletedRowCount = await db.Post.destroy({
      where:{id:id}
    })
    if(deletedRowCount===0){
      return res.status(404).json({error:'게시글을 찾을 수 없거나 삭제되었습니다.'})
    }
    res.status(204).send();
  }catch(error){
    console.error(`ID ${id}번 게시글 삭제 실패:`, error );
    res.status(500).json({error:'서버오류: 게시글 삭제 실패'})
  }
})

app.listen(PORT, () => {
    console.log(`Start server!!! http://localhost:${PORT}`);
})