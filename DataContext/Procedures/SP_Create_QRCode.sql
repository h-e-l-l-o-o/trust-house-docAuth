CREATE OR ALTER PROCEDURE dbo.SP_Create_QRCode
    @DocID               INT,
    @EncryptedToken     NVARCHAR(512)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM dbo.TBL_Docs
        WHERE DocID   = @DocID
          AND IsActive = 1
    )
    BEGIN
        THROW 51000, 'Bad DocID.', 1;
    END

    INSERT INTO dbo.TBL_QRCode
        (DocID, EncryptedToken, LinkCreatedAt, ScannedCount)
    VALUES
        (@DocID, @EncryptedToken, GETDATE(), 0);
END
GO
