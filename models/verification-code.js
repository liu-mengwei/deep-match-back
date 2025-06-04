export default (sequelize, DataTypes) => {
  const VerificationCode = sequelize.define(
    "VerificationCode",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(6),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "expires_at",
      },
      isUsed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_used",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "created_at",
      },
    },
    {
      tableName: "verification_codes",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return VerificationCode;
};  