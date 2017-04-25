'use strict';
module.exports = function(sequelize, DataTypes) {
    var disease = sequelize.define('disease', {
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        isTerminal: DataTypes.BOOLEAN,
        severity: DataTypes.INTEGER,
        transmission: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                models.disease.belongsToMany(models.symptom, { through: models.disease_symptom });
            }
        }
    });
    return disease;
};
