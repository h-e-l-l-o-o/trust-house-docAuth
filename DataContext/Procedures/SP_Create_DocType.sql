CREATE OR ALTER PROCEDURE SP_Create_DocType
    @DocTypeDesc NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM TBL_LK_DocType WHERE DocTypeDesc = @DocTypeDesc AND IsActive = 1)
    BEGIN
        THROW 51000, 'Doc with same name already exists', 1;
    END

    INSERT INTO TBL_LK_DocType (DocTypeDesc, IsActive)
    VALUES (@DocTypeDesc, 1);
END;
