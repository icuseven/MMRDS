//using Microsoft.AspNetCore.Components;
//using Microsoft.AspNetCore.Components.Web;


var builder = WebApplication.CreateBuilder(args);
//builder.Services.AddRazorPages();
//builder.Services.AddServerSideBlazor();


var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();

provider.Mappings[".pdb"] = "application/octet-stream";
provider.Mappings[".dat"] = "application/octet-stream";

app.UseStaticFiles
(
    new StaticFileOptions 
    {
        ContentTypeProvider = provider
    }
);


app.UseRouting();

app.MapBlazorHub();
app.MapFallbackToPage("/_Host");

app.Run("http://localhost:1234");
