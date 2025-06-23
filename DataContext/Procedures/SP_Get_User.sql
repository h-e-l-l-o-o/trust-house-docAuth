CREATE OR ALTER PROCEDURE dbo.SP_Get_User
    @UserID INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        u.UserID,
        u.UserName,
        u.Email,
        u.EmpFName,
        u.EmpSName,
        u.EmpThName,
        u.EmpFmName,
        u.IDNo,
        u.IDDate,
        RolesCsv = COALESCE(
            STRING_AGG(r.UserRoleDesc, ','),
            ''                        
        )
    FROM dbo.TBL_Users AS u
    LEFT JOIN dbo.TBL_LK_UserRole AS r
        ON u.UserID = r.UserID
    WHERE
        (@UserID IS NULL OR u.UserID = @UserID) AND u.IsActive = 1
    GROUP BY
        u.UserID,
        u.UserName,
        u.Email,
        u.EmpFName,
        u.EmpSName,
        u.EmpThName,
        u.EmpFmName,
        u.IDNo,
        u.IDDate,
        u.IsActive
    ORDER BY
        u.UserID;
END
GO
