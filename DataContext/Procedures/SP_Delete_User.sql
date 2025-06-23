CREATE OR ALTER PROCEDURE SP_Delete_User
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;

        IF NOT EXISTS(
            SELECT 1 FROM TBL_Users WHERE TBL_Users.UserID = @UserID AND TBL_Users.isActive = 1
        )BEGIN
            THROW 50001, 'User Doesnt Exist.', 1;
        END;

            UPDATE TBL_Users
            SET IsActive = 0 
            WHERE UserID = @UserID;

            DELETE FROM TBL_UserToken
            WHERE UserID = @UserID;
END;