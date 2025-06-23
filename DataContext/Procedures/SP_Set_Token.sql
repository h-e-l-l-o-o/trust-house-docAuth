CREATE PROCEDURE dbo.SP_Set_User_Token
    @UserID         INT,
    @TokenID        VARCHAR(255),
    @CreationDate   DATETIME,
    @DeviceID       VARCHAR(255),
    @ExpirationDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    
    IF EXISTS (
        SELECT 1 FROM dbo.TBL_UserToken
        WHERE DeviceID = @DeviceID AND IsActive = 1
    )
    BEGIN
        UPDATE dbo.TBL_UserToken
        SET 
            TokenID = @TokenID,
            ExpirationDate = @ExpirationDate
        WHERE 
            DeviceID = @DeviceID AND IsActive = 1;
    END
    ELSE
    BEGIN
        INSERT INTO dbo.TBL_UserToken (
            TokenID, UserID, DeviceID, CreationDate, ExpirationDate, IsActive
        )
        VALUES (
            @TokenID, @UserID, @DeviceID, @CreationDate, @ExpirationDate, 1
        );
    END
END;
GO
