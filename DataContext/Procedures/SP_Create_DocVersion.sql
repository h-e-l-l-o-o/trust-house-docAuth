CREATE OR ALTER PROCEDURE SP_Create_DocVersion
    @DocID          INT,
    @FilePath       NVARCHAR(255),
    @DocStatusID    INT,
    @OldFilePath    NVARCHAR(255) = NULL OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
     
        UPDATE TBL_Docs
        SET DocStatusID = @DocStatusID
        WHERE DocID = @DocID AND IsActive = 1;  
        IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'Invalid Doc.', 1;
        END

        SELECT @OldFilePath = DV.FilePath
        FROM TBL_DocVersion AS DV
        WHERE DV.DocID = @DocID AND DV.IsFinal = 1;

        PRINT 'Old File Path: ' + @OldFilePath;

        INSERT INTO TBL_DocVersion (DocID, FilePath, IsFinal, UploadedAt)
        VALUES (@DocID, @FilePath, 0, GETDATE());

        UPDATE TBL_DocVersion
        SET IsFinal = 0
        WHERE DocID = @DocID;

        WITH LatestVersion AS (
            SELECT TOP 1 VersionID
            FROM TBL_DocVersion
            WHERE DocID = @DocID
            ORDER BY UploadedAt DESC, VersionID DESC
        )

        UPDATE TBL_DocVersion
        SET IsFinal = 1
        WHERE VersionID IN (SELECT VersionID FROM LatestVersion);

        COMMIT TRANSACTION;
END;
