logged in users have two roles admin and normal user
- jwt stores role as isAdmin

two get endpoints, one for admin only, one for all to use

when not logged in --> ie with no valid JWT, all are unauthenticated
when logged in as normal user --> only can get 200 from allFunc
when logged in as admin --> get 200 from both get endpoints