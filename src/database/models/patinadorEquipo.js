const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class PatinadorEquipo extends Model {}

    PatinadorEquipo.init({

        patinadorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'patinador', // nombre de la tabla
                key: 'id'
            },
            field: 'patinador_id' // Esto especifica el nombre de la columna en la base de datos
        },

        equipoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'equipo', // nombre de la tabla
                key: 'id'
            },
            field: 'equipo_id' // Esto especifica el nombre de la columna en la base de datos
        },
        // Aquí puedes agregar otras columnas necesarias, como las claves foráneas
        roster: {
            type: DataTypes.BOOLEAN,
            defaultValue: false // Puedes establecer un valor por defecto
        }
    }, {
        
        sequelize,
        modelName: 'PatinadorEquipo',
        tableName: 'patinador_equipo', // Asegúrate de que el nombre de la tabla coincida con el que usas en la base de datos
        timestamps: true,// Asumiendo que no necesitas timestamps para esta tabla
        underscored: true,
    });

    return PatinadorEquipo;
};