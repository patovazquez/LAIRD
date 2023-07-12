const {sequelize, DataTypes} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
const Noticia = sequelize.define('Noticia', {

    created_by: DataTypes.INTEGER,
    title:DataTypes.STRING,
    resume:DataTypes.STRING, 
    description:DataTypes.STRING,   
    image:DataTypes.STRING,    
    link:DataTypes.STRING, 
     

},{
    underscored: true,
    timestamps: true,
    tableName: "Noticias"
    
});

Noticia.associate = (models =>{
    Noticia.belongsTo(models.Liga,{foreignKey: 'created_by' });

}); 



return Noticia

}