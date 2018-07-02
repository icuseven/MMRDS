public class ApplicationUser 
{
    public string UserName { get; set; }
    public string Password { get; set; }

    public ApplicationUser() { }
    public ApplicationUser(string username, string password) 
    {
        this.UserName = username;
        this.Password = password;
    }
}