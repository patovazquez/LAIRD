const {sequelize, DataTypes} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
const Venta = sequelize.define('Venta', {
    
    title: DataTypes.STRING,
    condition: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    image:DataTypes.STRING,
    contact:DataTypes.STRING,
    created_by: DataTypes.INTEGER    

},{
    underscored: true,
    timestamps: true,
    tableName: "ventas"
    
});

Venta.associate = (models =>{
    Venta.belongsTo(models.Patinador,{foreignKey: 'created_by' });

}); 



return Venta
}