module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        email: {
            type: DataTypes.STRING 
        },
        password: {
            type: DataTypes.STRING 
        },
        name: {
            type: DataTypes.STRING 
        }
    }, {
        freezeTableName: true,
        timestamps: false 
    })
    User.associate = models => {
        User.hasMany(models.Habits, {
            foreignKey: "userId"
        })
    }
    return User;
}