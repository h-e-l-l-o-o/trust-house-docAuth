CREATE OR ALTER PROCEDURE SP_Create_User
    @UserName   NVARCHAR(50),
    @Email      NVARCHAR(255),
    @EmpFName   NVARCHAR(50),
    @EmpSName   NVARCHAR(50),
    @EmpThName  NVARCHAR(50),
    @EmpFmName  NVARCHAR(50),
    @Password   NVARCHAR(255),
    @IDNo       NVARCHAR(50),
    @IDDate     DATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM dbo.TBL_Users as tbl_User
        WHERE (tbl_User.UserName = @UserName OR tbl_User.Email = @Email OR tbl_User.IDNo = @IDNo OR
        (tbl_User.EmpFName = @EmpFName AND tbl_User.EmpSName = @EmpSName AND tbl_User.EmpThName = @EmpThName))
        AND tbl_User.IsActive = 1
    )
    BEGIN
        THROW 51000, 'User with the same username or email already exists.', 1;
    END

    INSERT INTO dbo.TBL_Users (
        UserName, Email, EmpFName, EmpSName, EmpThName, EmpFmName, Password, IDNo, IDDate, IsActive
    )    -- Insert new user

    VALUES (
        @UserName, @Email, @EmpFName, @EmpSName, @EmpThName, @EmpFmName, @Password, @IDNo, @IDDate, 1
    );
END;
