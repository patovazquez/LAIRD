const {sequelize, DataTypes} = require('sequelize');

module.exports = (sequelize, DataTypes) => {



const Equipo = sequelize.define('Equipo', {    
    
    created_by: DataTypes.INTEGER,
    name:DataTypes.STRING,
    category:DataTypes.STRING,
    adress:DataTypes.STRING,
    training_days:DataTypes.STRING,
    province:DataTypes.STRING,
    city:DataTypes.STRING,
    description: DataTypes.STRING,
    logo:DataTypes.STRING,
    image:DataTypes.STRING,
    contact:DataTypes.STRING,
    condition:DataTypes.STRING,
    link:DataTypes.STRING,
    ranking: DataTypes.INTEGER,

},{
    underscored: true,
    timestamps: true,
    tableName: "equipo"
    
});

Equipo.associate = (models =>{
    Equipo.belongsTo(models.Liga,{foreignKey: 'created_by' });

    /*Equipo.belongsToMany(models.Patinador,{
        as: 'patinadores', //este alias me ayuda a incluir los patinadores en consultas donde aparezcan esta relacion de muchos a muchos 
        through: 'patinador_equipo'
    });*/

    Equipo.belongsToMany(models.Patinador, {        
        through: models.PatinadorEquipo, // Usa el modelo en lugar de solo el nombre de la tabla
        foreignKey: 'equipoId', // Asegúrate de especificar la clave foránea correcta si es necesario
        otherKey: 'patinadorId',
        as: 'patinadores'
    });
    

}); 



return Equipo
}