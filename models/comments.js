module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define("Comments", {
        text: {
            type: DataTypes.TEXT 
        },
        habitId: {
            type: DataTypes.INTEGER,
            references: {
                model: "Habits",
                foreignKey: "id"
            } 
        }
    }, {
        freezeTableName: true
    })
    Comments.associate = models => {
        Comments.belongsTo(models.Habits, {
            foreignKey: "habitId",
            onDelete: "cascade"
        })
    }
    return Comments;
}