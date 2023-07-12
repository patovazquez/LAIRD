module.exports = function(sequelize, DataTypes) {
    
    

    const Liga = sequelize.define('Liga',{    
            
        email: DataTypes.STRING,
        password:DataTypes.STRING,
        name:DataTypes.STRING,
        link_insta:DataTypes.STRING,
        link_web:DataTypes.STRING,
        province:DataTypes.STRING,
        city:DataTypes.STRING,
        description: DataTypes.STRING,
        image:DataTypes.STRING,
        tipe:DataTypes.STRING,
        condition:DataTypes.STRING,
        selection:DataTypes.STRING,
        permission:DataTypes.STRING,
    },{
        underscored: true,
        timestamps: true,
        
    });

    Liga.associate = (models=>{
        Liga.hasMany(models.Equipo, {foreignKey: 'created_by' })
        Liga.hasMany(models.Evento, {foreignKey: 'created_by' })
        Liga.hasMany(models.Noticia, {foreignKey: 'created_by' })

    }); 

    return Liga  

}