module.exports = function(sequelize, DataTypes) {
    
    

    const Patinador = sequelize.define('Patinador',{        

        email: DataTypes.STRING,
        password:DataTypes.STRING,
        derby_name:DataTypes.STRING,
        number:DataTypes.INTEGER,
        pronoun:DataTypes.STRING,
        province:DataTypes.STRING,
        play:DataTypes.STRING,
        ref: DataTypes.STRING,
        coach:DataTypes.STRING,
        avatar:DataTypes.STRING,
        tipe:DataTypes.STRING,        
    },{
        underscored: true,
        timestamps: true,
        tableName: "patinador"
        
    });

    Patinador.associate = (models=>{
        Patinador.hasMany(models.Venta, {foreignKey: 'created_by' })

        Patinador.belongsToMany(models.Equipo, {
            through: 'patinador_equipo',
        });
        
    }); 

    return Patinador  

}