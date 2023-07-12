const {sequelize, DataTypes} = require('sequelize');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
const Evento = sequelize.define('Evento', {

    
        created_by: DataTypes.INTEGER,  
        name:DataTypes.STRING,
        tipe: DataTypes.STRING,
        resume: DataTypes.STRING,
        description:DataTypes.STRING,
        info: DataTypes.STRING,
        province:DataTypes.STRING,
        city:DataTypes.STRING,
        adress: DataTypes.STRING,
        place: DataTypes.STRING,
        schedules: DataTypes.STRING,
        startdate: { type: DataTypes.DATEONLY, get() { return moment(this.getDataValue('startdate')).add(3, 'hours').format('DD/MM/YYYY');  },allowNull:false },
        finishdate: { type: DataTypes.DATEONLY, get() { return moment(this.getDataValue('finishdate')).add(3, 'hours').format('DD/MM/YYYY');  },allowNull:false },
        month: DataTypes.STRING,
        poster: DataTypes.STRING,
        link_officiate: DataTypes.STRING,
        link_enroll: DataTypes.STRING,
        link_participate: DataTypes.STRING,
        link_insta: DataTypes.STRING,
        
    

},{
    underscored: true,
    timestamps: true,
    
});

Evento.associate = (models =>{
    Evento.belongsTo(models.Liga,{foreignKey: 'created_by' });

}); 



return Evento
}