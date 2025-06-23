CREATE OR ALTER PROCEDURE SP_Set_Roles
    @UserID INT,
    @RolesCSV NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
        
        DECLARE @Roles TABLE (Role NVARCHAR(50));

        INSERT INTO @Roles (Role)
        SELECT TRIM(value)
        FROM STRING_SPLIT(@RolesCSV, ',')
        WHERE TRIM(value) <> '';

        DELETE FROM TBL_LK_UserRole
        WHERE UserID = @UserID;

        INSERT INTO TBL_LK_UserRole (UserID, UserRoleDesc, IsActive)
        SELECT @UserID, Role, 1
        FROM @Roles;

        COMMIT TRANSACTION;
END;