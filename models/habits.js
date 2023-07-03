module.exports = (sequelize, DataTypes) => {
    const Habits = sequelize.define("Habits", {
        title: {
            type: DataTypes.STRING 
        },
        type: {
            type: DataTypes.STRING
        },
        streakNumber: {
            type: DataTypes.INTEGER,
            defaultValue: 0 
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: "User",
                foreignKey: "id"
            }
        }
    }, {
        freezeTableName: true,
        timestamps: false
    })
    Habits.associate = models => {
        Habits.belongsTo(models.User, {
            foreignKey: "userId",
            onDelete: "cascade"
        })
    }
    return Habits;
}
