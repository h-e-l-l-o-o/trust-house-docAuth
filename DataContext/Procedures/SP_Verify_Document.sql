CREATE OR ALTER PROCEDURE dbo.SP_Verify_Document
    @EncryptedToken NVARCHAR(512),
    @ExpiryDate     DATE           OUTPUT,
    @FilePath       NVARCHAR(255)  OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS(
        SELECT 1
        FROM dbo.TBL_QRCode qr
        JOIN dbo.TBL_Docs   doc
          ON doc.DocID = qr.DocID
        WHERE qr.EncryptedToken = @EncryptedToken
          AND doc.IsActive = 1
    )
        THROW 51002, 'Invalid or inactive QR-token.', 1;

    SELECT
        @ExpiryDate = doc.ExpiryDate,
        @FilePath   = dv.FilePath
    FROM dbo.TBL_QRCode      AS qr
    JOIN dbo.TBL_Docs        AS doc 
      ON doc.DocID = qr.DocID
    LEFT JOIN dbo.TBL_DocVersion AS dv
      ON dv.DocID   = doc.DocID
     AND dv.IsFinal = 1
    WHERE qr.EncryptedToken = @EncryptedToken;

  IF @ExpiryDate >= CAST(GETDATE() AS DATE)
    BEGIN
        UPDATE dbo.TBL_QRCode
           SET LastScannedAt = GETDATE(),
               ScannedCount   = ScannedCount + 1
         WHERE EncryptedToken = @EncryptedToken;
    END
END
GO
