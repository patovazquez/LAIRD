module.exports = function(sequelize, DataTypes) {
    
    

    const Patinador = sequelize.define('Patinador',{        

        email: DataTypes.STRING,
        password:DataTypes.STRING,
        derby_name:DataTypes.STRING,
        number:DataTypes.STRING,
        pronoun:DataTypes.STRING,
        province:DataTypes.STRING,
        play:DataTypes.STRING,
        ref: DataTypes.STRING,
        coach:DataTypes.STRING,
        volun:DataTypes.STRING,
        avatar:DataTypes.STRING,
        condition:DataTypes.STRING,   
        permission:DataTypes.STRING,     
    },{
        underscored: true,
        timestamps: true,
        tableName: "patinador"
        
    });

    Patinador.associate = (models=>{
        Patinador.hasMany(models.Venta, {foreignKey: 'created_by' })

        /*Patinador.belongsToMany(models.Equipo, {
            through: 'patinador_equipo',
        });*/

        Patinador.belongsToMany(models.Equipo, {
            through: models.PatinadorEquipo, // Usa el modelo en lugar de solo el nombre de la tabla
            foreignKey: 'patinadorId', // Asegúrate de especificar la clave foránea correcta si es necesario
            otherKey: 'equipoId'
        });
        
    }); 

    return Patinador  

}