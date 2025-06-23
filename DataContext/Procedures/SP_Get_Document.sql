CREATE OR ALTER PROCEDURE SP_Get_Document
    @DocID INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        D.DocID,
        D.DocTypeID,
        D.DocStatusID,
        D.CreatedByUserID,
        D.DocNumber,
        D.DocDate,
        D.DocDesc,
        D.ExpiryDate,
        D.CreationDate,
        D.IsActive,
        DV.VersionID,
        DV.FilePath,
        DV.IsFinal,
        DV.UploadedAt,
        U.Email as CreatedByEmail,
        DT.DocTypeDesc as DocType
    FROM
        TBL_Docs D
    LEFT JOIN
        TBL_DocVersion DV ON (DV.DocID = D.DocID AND DV.IsFinal = 1)
    LEFT JOIN
        TBL_Users U ON (D.CreatedByUserID = U.UserID)
    LEFT JOIN
        TBL_LK_DocType as DT ON (DT.DocTypeID = D.DocTypeID)
    WHERE
        @DocID IS NULL OR D.DocID = @DocID
    ORDER BY
        D.DocID;
END;
