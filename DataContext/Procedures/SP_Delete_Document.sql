CREATE OR ALTER PROCEDURE SP_Delete_Doc
    @DocID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
        UPDATE TBL_Docs
        SET 
            IsActive    = 0,     
            DocStatusID = 4     
        WHERE 
            DocID    = @DocID
            AND IsActive = 1;   

        IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'Document not found or already inactive.', 1;
        END

        COMMIT TRANSACTION;
END;
GO
