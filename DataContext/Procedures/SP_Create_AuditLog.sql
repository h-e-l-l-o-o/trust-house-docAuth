CREATE OR ALTER PROCEDURE SP_Create_AuditLog
    @DocID INT,
    @ActionID INT,
    @UserID INT,
    @LogDesc NVARCHAR(1023)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO TBL_AuditLog (
        DocID,
        ActionID,
        UserID,
        TimeStamp,
        LogDesc
    )
    VALUES (
        @DocID,
        @ActionID,
        @UserID,
        GETDATE(),
        @LogDesc
    );
END;
