CREATE OR ALTER PROCEDURE SP_Create_Document
    @DocTypeID          INT,
    @DocStatusID        INT,
    @CreatedByUserID    INT,
    @DocNumber          NVARCHAR(50),
    @DocDate            DATE,
    @DocDesc            NVARCHAR(50),
    @ExpiryDate         DATE,
    @FilePath           NVARCHAR(255),
    @FinalFilePath      NVARCHAR(255),
    @EncryptedToken     NVARCHAR(512)

AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NewDocID INT;

        BEGIN TRANSACTION;

        IF NOT EXISTS (
            SELECT 1
            FROM TBL_LK_DocType
            WHERE DocTypeID = @DocTypeID AND IsActive = 1
        )
        BEGIN
            ROLLBACK TRANSACTION;
            THROW 50001, 'Invalid Doctype.', 1;
        END

        --this only works if its a table and i get the id this way for safety reason i 
        --remember you telling me the  SCOPE_IDENTITY() is insecure
        DECLARE @Output TABLE (DocID INT);
        
        INSERT INTO TBL_Docs (
            DocTypeID,
            DocStatusID,
            CreatedByUserID,
            DocNumber,
            DocDate,
            DocDesc,
            ExpiryDate,
            CreationDate,
            IsActive
        )
        OUTPUT INSERTED.DocID INTO @Output
        VALUES (
            @DocTypeID,
            @DocStatusID,
            @CreatedByUserID,
            @DocNumber,
            @DocDate,
            @DocDesc,
            @ExpiryDate,
            GETDATE(),
            1
        );

        SELECT @NewDocID = DocID FROM @Output;

        EXEC SP_Create_DocVersion
            @DocID = @NewDocID,
            @DocStatusID = @DocStatusID,
            @FilePath = @FilePath;

        EXEC SP_Create_QRCode
            @DocID = @NewDocID,
            @EncryptedToken = @EncryptedToken;         

        EXEC SP_Create_DocVersion
            @DocID = @NewDocID,
            @DocStatusID = @DocStatusID,
            @FilePath = @FinalFilePath;

        EXEC SP_Create_AuditLog
            @DocID = @NewDocID,
            @ActionID = 1,
            @UserID = @CreatedByUserID,
            @LogDesc = 'Created  Document';

        COMMIT TRANSACTION;
END;
