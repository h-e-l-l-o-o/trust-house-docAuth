CREATE OR ALTER PROCEDURE SP_Delete_DocType
    @DocTypeID INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM TBL_LK_DocType WHERE DocTypeID = @DocTypeID AND IsActive = 1)
    BEGIN
        THROW 51000, 'DocType does not exist!', 1;
    END

    UPDATE TBL_LK_DocType
    SET IsActive = 0
    WHERE DocTypeID = @DocTypeID;
END;
