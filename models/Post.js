const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
   const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
     title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
        type:DataTypes.INTEGER,
        allowNull:false,
        field: 'userId'
    }
  }, {
    tableName: 'posts', // 실제 데이터베이스 테이블 이름
    timestamps: true, // createdAt, updatedAt 자동 생성
    underscored: true, // 컬럼명을 snake_case로 자동 변환 (e.g., firstName -> first_name)
  });
  
    Post.associate = (models) => {
    
    };
  return Post;
}