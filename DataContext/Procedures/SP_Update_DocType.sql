CREATE OR ALTER PROCEDURE SP_Update_DocType
    @DocTypeID INT,
    @NewDocTypeDesc NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM TBL_LK_DocType WHERE DocTypeID = @DocTypeID AND IsActive = 1)
    BEGIN
        THROW 51000, 'Doc with same name already exists OR invalid ID', 1;
    END

    UPDATE TBL_LK_DocType
    SET DocTypeDesc = @NewDocTypeDesc
    WHERE DocTypeID = @DocTypeID;
END;
